import { Router } from "express";
import UserAgent from "user-agents";
import Prettify from "../Utils/trainPretty.js";
import schedule from "node-schedule";
const prettify = new Prettify();
const router = Router();

const extractTrainInfo = (data) => {
    const startTime = data.from_time;
  
    return { startTime };
};

const NotifiyServer = async ({ trainNo, boardingStation, travelDate, train_stTime }) => {
  try {
    const scheduleTime = new Date();
    scheduleTime.setHours(16, 35, 0, 0); // Set the time to 16:25:00.000

    schedule.scheduleJob(scheduleTime, async () => {
      const train_chart = "https://www.irctc.co.in/online-charts/api/trainComposition";
      const payload = {
        trainNo: trainNo,
        jDate: travelDate,
        boardingStation: boardingStation
      };

      const response = await fetch(train_chart, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Scheduled job executed, data:', data);
    });

    return { msg: "Retrived Successfully" ,data : data};
  } catch (err) {
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

router.post("/getTrains", async (req, resp) => {
    const arr = [];
    const retval = {};
    const {from,to,date} = req.body
    if (date == null) {
      retval["success"] = false;
      retval["time_stamp"] = Date.now();
      retval["data"] = "Please Add Specific Date";
      resp.json(retval);
      return;
    }
    const URL_Trains = `https://erail.in/rail/getTrains.aspx?Station_From=${from}
    &Station_To=${to}
    &DataSource=0&Language=0&Cache=true`;
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
      const DD = date.split("-")[0];
      const MM = date.split("-")[1];
      const YYYY = date.split("-")[2];
      const day = prettify.getDayOnDate(DD, MM, YYYY);
      json["data"].forEach((ele, ind) => {
        if (ele["train_base"]["running_days"][day] == 1) arr.push(ele);
      });
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = arr;
      resp.json(retval);
    } catch (err) {
      console.log(err);
    }
  });

router.post("/getRoute", async (req, resp) => {
  const {trainNo} = req.body;
  try {
    let URL_Train = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}&DataSource=0&Language=0&Cache=true`;
    let response = await fetch(URL_Train);
    let data = await response.text();
    let json = prettify.CheckTrain(data);
    if (!json["success"]) {
      resp.json(json);
      return;
    }
    URL_Train = `https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${json["data"]["train_id"]}&Data2=0&Cache=true`;
    response = await fetch(URL_Train);
    data = await response.text();
    json = prettify.GetRoute(data);
    resp.send(json);
  } catch (err) { 
    console.log(err.message);
  }
});





export default router;