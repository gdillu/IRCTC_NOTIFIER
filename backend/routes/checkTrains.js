import { Router } from "express";
import UserAgent from "user-agents";
import Prettify from "../Utils/trainPretty.js";
import schedule from "node-schedule";
import moment from "moment-timezone";
import { bookingModel } from "../Model/trainModel.js";
import { IRCTCSEAT } from "./automation.js";
const prettify = new Prettify();
const router = Router();


const checkIfTrainRunsOnDay = (runningDays, day) => {
  return runningDays[day] === '1';
};


const NotifyServer = async ({ bookingid, scheduleTime }) => {
  try {
    // Parse scheduleTime with timezone offset
    const parsedScheduleTime = new Date(scheduleTime);

    // Convert parsedScheduleTime to IST string for logging
    const options = { timeZone: 'Asia/Kolkata', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istScheduleTime = parsedScheduleTime.toLocaleString('en-IN', options);
    
    console.log("Parsed schedule time (IST):", istScheduleTime);

    const job = schedule.scheduleJob(parsedScheduleTime, async () => {
      try {
        const data = await bookingModel.findOne({ _id: bookingid });
        if (!data) throw new Error("Data not found in Database");

        const seatparams = {
          class: data.class,
          quota: data.quota,
          train_number: data.train_number,
          from: data.from,
          to: data.to,
          journey_date: data.journey_date,
          userID: data.userID,
          password: data.password
        };
        
        // Call the IRCTCSEAT function
        const response = await IRCTCSEAT(seatparams);
        if (!response) throw new Error("Error While Fetching Seats");


        console.log("Seats are available:", response);

      } catch (err) {
        console.error("Error in scheduled job:", err.message);
      }
    });

    if (job) {
      console.log("Job successfully scheduled for (IST):", istScheduleTime);
    } else {
      console.error("Failed to schedule job. Job returned as null.");
    }

    return { msg: "Notification Successfully Created" };
  } catch (err) {
    console.error("Error in Scheduling the time:", err.message);
    throw new Error("Error scheduling the notification");
  }
};


router.post("/notify", async (req, res) => {
  const { scheduletime, bookingparams } = req.body;

  try {
    console.log("Received schedule time (with timezone offset):", scheduletime);

    const bookingData = new bookingModel(bookingparams);
    const savedBooking = await bookingData.save();

    const result = await NotifyServer({ bookingid: savedBooking._id, scheduleTime : scheduletime});
    console.log("Saved booking ID:", savedBooking._id);
    console.log("Scheduled execution time (with timezone offset):", scheduletime);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /notify route:", err.message);
    res.status(500).send({ msg: "Train Data Couldn't be Fetched" });
  }
});



const parseDateTime = (dateString, timeString) => {
  const [day, month, year] = dateString.split("-");
  const [hours, minutes] = timeString.split(".").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return date;
};

// Ensure moment-timezone is imported at the start

router.post("/getTrains", async (req, resp) => {
  const arr = [];
  const retval = {};
  const { from, to, date } = req.body;

  if (!date) {
    retval["success"] = false;
    retval["time_stamp"] = Date.now();
    retval["data"] = "Please Add Specific Date";
    resp.json(retval);
    return;
  }

  const URL_Trains = `https://erail.in/rail/getTrains.aspx?Station_From=${from}&Station_To=${to}&DataSource=0&Language=0&Cache=true`;

  try {
    const userAgent = new UserAgent();
    const response = await fetch(URL_Trains, {
      method: "GET",
      headers: { "User-Agent": userAgent.toString() },
    });

    const data = await response.text();
    const json = prettify.BetweenStation(data);

    if (!json["success"]) {
      resp.json(json);
      return;
    }

    const [DD, MM, YYYY] = date.split("-");
    const dateObj = new Date(`${YYYY}-${MM}-${DD}`);
    const day = dateObj.getDay();
    const adjustedDay = (day + 6) % 7;

    for (const ele of json["data"]) {
      if (checkIfTrainRunsOnDay(ele["train_base"]["running_days"], adjustedDay)) {
        const trainNo = ele["train_base"]["train_no"];
        const trainData = await getTrainRoute(trainNo);

        for (const station of trainData) {
          if (station.source_stn_code === from) {
            const chartingStation = trainData.find(st => st.source_stn_code === station.chartingstation);
            if (chartingStation) {
              let StationDate = date;
              let chartStationDate = date;

              if (parseInt(chartingStation.day) < parseInt(station.day)) {
                chartStationDate = moment(StationDate, "DD-MM-YYYY").subtract(1, 'days').format("DD-MM-YYYY");
              }

              const chartStationTime = parseDateTime(chartStationDate, chartingStation.depart); 
              const chartStationclose = moment(chartStationTime).subtract(30,'minutes')
              const chartTime = moment(chartStationTime).subtract(4, 'hours');
              const currentTimeIST = moment.tz("Asia/Kolkata");

              const timeDifference = chartTime.diff(currentTimeIST);
              ele["train_base"]["chartingStation"] = chartingStation.chartingstation;

              if (currentTimeIST.isBefore(chartTime)) {
                const scheduledTimeIST = chartTime
                ele["train_base"]["scheduled_time"] = scheduledTimeIST.format('YYYY-MM-DDTHH:mm:ssZ');
                arr.push(ele);

              } else if (currentTimeIST.isAfter(chartTime) && currentTimeIST.isBefore(chartStationclose)) {
                ele["train_base"]["statement"] = "Chart is Prepared And train Not Departed";
                arr.push(ele);

              } else if (currentTimeIST.isAfter(moment.tz(`${currentTimeIST.format("YYYY-MM-DD")} ${station.depart}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata"))) {
                ele["train_base"]["statement"] = "Train Departed";
                arr.push(ele);

              } else {
                ele["train_base"]["statement"] = "Not available";
                arr.push(ele);
              }
            }
          }
        }
      }
    }

    retval["success"] = true;
    retval["time_stamp"] = Date.now();
    retval["data"] = arr;
    resp.json(retval);

  } catch (err) {
    console.log(err);
    retval["success"] = false;
    retval["time_stamp"] = Date.now();
    retval["data"] = "Error occurred";
    resp.json(retval);
  }
});





async function getTrainRoute(trainNo) {
  try {
    let URL_Train = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}&DataSource=0&Language=0&Cache=true`;
    let response = await fetch(URL_Train);
    let data = await response.text();
    let json = prettify.CheckTrain(data);
    if (!json["success"]) {
      return json;
    }

    URL_Train = `https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${json["data"]["train_id"]}&Data2=0&Cache=true`;
    response = await fetch(URL_Train);

    data = await response.text();
    json = await prettify.GetRoute(data,trainNo);

    return json["data"];
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

router.post('/getRoute', async (req, res) => {
  const { trainNo } = req.body;

  if (!trainNo) {
    return res.status(400).json({ success: false, message: 'trainNo is required' });
  }

  try {
    const routeData = await getTrainRoute(trainNo);
    res.json(routeData);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;