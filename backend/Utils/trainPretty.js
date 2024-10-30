let data2 = new String();
import { TrainChartStationModel } from "../Model/trainModel.js";
class Prettify {
  BetweenStation(string) {
    try {
      let obj = {};
      let retval = {};
      let arr = [];
      let obj2 = {};
      let data = string.split("~~~~~~~~");
      let nore = data[0].split("~");
      nore = nore[5].split("<");
      if (nore[0] == "No direct trains found") {
        retval["success"] = false;
        retval["time_stamp"] = Date.now();
        retval["data"] = nore[0];
        return retval;
      }
      if (
        data[0] === "~~~~~Please try again after some time." ||
        data[0] === "~~~~~From station not found" ||
        data[0] === "~~~~~To station not found"
      ) {
        retval["success"] = false;
        retval["time_stamp"] = Date.now();
        retval["data"] = data[0].replaceAll("~", "");
        return retval;
      }
      data = data.filter((el) => {
        return el != "";
      });
      for (let i = 0; i < data.length; i++) {
        let data1 = data[i].split("~^");
        if (data1.length === 2) {
          data1 = data1[1].split("~");
          data1 = data1.filter((el) => {
            return el != "";
          });
          obj["train_no"] = data1[0];
          obj["train_name"] = data1[1];
          obj["source_stn_name"] = data1[2];
          obj["source_stn_code"] = data1[3];
          obj["dstn_stn_name"] = data1[4];
          obj["dstn_stn_code"] = data1[5];
          obj["from_stn_name"] = data1[6];
          obj["from_stn_code"] = data1[7];
          obj["to_stn_name"] = data1[8];
          obj["to_stn_code"] = data1[9];
          obj["from_time"] = data1[10];
          obj["to_time"] = data1[11];
          obj["travel_time"] = data1[12];
          obj["running_days"] = data1[13];
          obj2["train_base"] = obj;
          arr.push(obj2);
          obj = {};
          obj2 = {};
        }
      }
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = arr;
      return retval;
    } catch (err) {
      console.warn(err.message);
    }
  }

   getDayOnDate(DD, MM, YYYY) {
    let date = new Date(YYYY, MM, DD);
    let day =
      date.getDay() >= 0 && date.getDay() <= 2
        ? date.getDay() + 4
        : date.getDay() - 3;
    return day;
  }

  async GetRoute(string,trainNumber) {
    try {
      let data = string.split("~^");
      let arr = [];
      let stations = [];
      let obj = {};
      let retval = {};
      let lastRLStationCode = "";
      let chartingStations = await TrainChartStationModel.findOne({ trainNumber })
      .then((result) => {
        if (result && result.stations) {
          return result.stations; // Assuming `stations` is the field holding the charting stations
        } else {
          return []; // Return empty array if no charting stations found
        }
      })
      .catch((err) => {
        console.log(`Error fetching charting stations: ${err.message}`);
        return []; // Return empty array in case of error
      });
  
      for (let i = 0; i < data.length; i++) {
        let data1 = data[i].split("~");
        data1 = data1.filter((el) => {
          return el != "";
        });
        obj["source_stn_name"] = data1[2];
        obj["source_stn_code"] = data1[1];
        obj["arrive"] = data1[3];
        obj["depart"] = data1[4];
        obj["distance"] = data1[6];
        obj["day"] = data1[7];
        if (chartingStations.length > 0){
          if(chartingStations.includes(data1[1])){
            lastRLStationCode = data1[1]
          }
        }
        else{
          if(data1.includes("RL")) {
            lastRLStationCode = data1[1];
            stations.push(lastRLStationCode)
          }
          if(i==0){
            lastRLStationCode = data1[1];
            stations.push(lastRLStationCode)
          }
        }
        obj["chartingstation"] = lastRLStationCode;
        arr.push(obj);
        obj = {};
        }
  
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = arr;

      if(chartingStations.length === 0){
        await this.insertTrainChartStations(trainNumber,stations);
      }
      return retval;
    } catch (err) {
      console.log(err.message);
    }
  }
  
  async insertTrainChartStations(trainNumber, stations) {
    try {
      // Check if trainNumber already exists
      let existingRecord = await TrainChartStationModel.findOne({ trainNumber });

      if (!existingRecord) {
        // If record does not exist, create a new entry
        const newRecord = new TrainChartStationModel({
          trainNumber: trainNumber,
          stations: stations
        });
        const savedData = await newRecord.save();
        console.log('New charting stations inserted:', savedData);
      }
    } catch (err) {
      console.error('Error inserting charting stations:', err.message);
      throw err; // Throw error to be caught in the calling function
    }
  }


  CheckTrain(string) {
    try {
      let obj = {};
      let retval = {};
      let data = string.split("~~~~~~~~");
      if (
        data[0] === "~~~~~Please try again after some time." ||
        data[0] === "~~~~~Train not found"
      ) {
        retval["success"] = false;
        retval["time_stamp"] = Date.now();
        retval["data"] = data[0].replaceAll("~", "");
        return retval;
      }
      let data1 = data[0].split("~");
      data1 = data1.filter((el) => {
        return el != "";
      });
      if (data1[1].length > 6) {
        data1.shift();
      }
      obj["train_no"] = data1[1].replace("^", "");
      obj["train_name"] = data1[2];
      obj["from_stn_name"] = data1[3];
      obj["from_stn_code"] = data1[4];
      obj["to_stn_name"] = data1[5];
      obj["to_stn_code"] = data1[6];
      obj["from_time"] = data1[11];
      obj["to_time"] = data1[12];
      obj["travel_time"] = data1[13];
      obj["running_days"] = data1[14];
      data1 = data[1].split("~");
      data1 = data1.filter((el) => {
        return el != "";
      });
      obj["type"] = data1[11];
      obj["train_id"] = data1[12];
      obj["distance_from_to"] = data1[18];
      obj["average_speed"] = data1[19];
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = obj;
      return retval;
    } catch (err) {
      console.warn(err.message);
    }
  }

  

}


export default Prettify;