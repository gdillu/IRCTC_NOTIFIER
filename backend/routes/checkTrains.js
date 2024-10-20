import { Router } from "express";
import UserAgent from "user-agents";
import Prettify from "../Utils/trainPretty.js";
import schedule from "node-schedule";
import moment from "moment-timezone";
import { TrainChartStationModel } from "../Model/userModel.js";
const prettify = new Prettify();
const router = Router();


async function getTrainComposition(trainNo, travelDate, boardingStation) {
  const train_chart = "https://www.irctc.co.in/online-charts/api/trainComposition";
  
  const payload = {
    trainNo: trainNo,
    jDate: reformatDate(travelDate),
    boardingStation: boardingStation
  };
  
  console.log(payload);

  try {
    const response = await fetch(train_chart, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
}


const extractTrainInfo = (data) => {
    const startTime = data.from_time;
    const startDate = data.from_date;
    return { startTime ,startDate};
};

const reformatDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};


const NotifiyServer = async ({ trainNo, boardingStation, travelDate,scheduleTime}) => {
  try {
    schedule.scheduleJob(scheduleTime, async () => {
      data = await getTrainComposition(trainNo,boardingStation,travelDate)
      console.log('Scheduled job executed, data:', data);
      if(data[error] !== null){
        return "Chart Prepared"
      }
      console.log("Executed at ",scheduleTime)
    });

    return { msg: "Notification Successfully Created"};
  } catch (err) {
    console.log("Error in Scheduling the time")
    throw new Error("Error scheduling the notification");
  }
};


router.post("/notify", async (req, res) => {
  const { trainNo, boardingStation, destination, travelDate } = req.body;

  try {
    const URL_Train = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}&DataSource=0&Language=0&Cache=true`;
    const response = await fetch(URL_Train);
    const raw_data = await response.text();
    const json = prettify.CheckTrain(raw_data);
    const train_stTime = extractTrainInfo(json.data);
    const result = await NotifiyServer({ trainNo, boardingStation, travelDate, train_stTime });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ msg: "Train Data Couldn't be Fetched" });
  }
});


const parseDateTime = (dateString, timeString) => {
  const [day, month, year] = dateString.split("-");
  const [hours, minutes] = timeString.split(".").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return date;
};

const findChartingStation = (trainData, chartStations, fromStation) => {
  let fromIndex = -1;

  // Find the index of the fromStation in the trainData array
  for (let i = 0; i < trainData.length; i++) {
    if (trainData[i].source_stn_code === fromStation) {
      fromIndex = i;
      break;
    }
  }

  if (fromIndex === -1) {
    throw new Error('From station not found in the train route');
  }

  let previousChartStation = null;

  // Iterate through the trainData array from the fromStation index backwards
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (chartStations.includes(trainData[i].source_stn_code)) {
      previousChartStation = trainData[i];
      break;
    }
  }

  let nextChartStation = null;

  // Iterate through the trainData array from the fromStation index forwards
  for (let i = fromIndex + 1; i < trainData.length; i++) {
    if (chartStations.includes(trainData[i].source_stn_code)) {
      nextChartStation = trainData[i];
      break;
    }
  }

  // Return the appropriate charting station based on the position
  if (previousChartStation && nextChartStation) {
    return previousChartStation;
  } else if (previousChartStation) {
    return previousChartStation;
  } else if (nextChartStation) {
    return nextChartStation;
  } else {
    throw new Error('No charting station found in the train route');
  }
};

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
    const day = prettify.getDayOnDate(DD, MM, YYYY);

    for (const ele of json["data"]) {
      if (ele["train_base"]["running_days"][day] == 1) {
        const trainNo = ele["train_base"]["train_no"];
        const trainData = await getTrainRoute(trainNo);
        const chartStationsList = await TrainChartStationModel.findOne({ trainNumber: trainNo });

        if (chartStationsList) {
          const chartStations = chartStationsList.stations;
          const chartingStation = findChartingStation(trainData, chartStations, from);

          if (chartingStation) {
            const chartStationTime = parseDateTime(date, chartingStation.depart);
            const chartStationTimeIST = moment.tz(chartStationTime, "Asia/Kolkata");
          
            // Get current time in IST
            const currentTimeIST = moment.tz("Asia/Kolkata");
          
            if (chartStationTimeIST.diff(currentTimeIST) > 4 * 60 * 60 * 1000) { // 4 hours in milliseconds
              const scheduledTimeIST = chartStationTimeIST.subtract(4, 'hours').toDate();
              ele["train_base"]["scheduled_time"] = scheduledTimeIST;
              arr.push(ele);
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
    console.log(json)
    if (!json["success"]) {
      return json;
    }

    URL_Train = `https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${json["data"]["train_id"]}&Data2=0&Cache=true`;
    response = await fetch(URL_Train);
    data = await response.text();
    json = prettify.GetRoute(data);

    return json["data"];
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}


export default router;