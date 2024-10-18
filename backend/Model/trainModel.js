import mongoose, { Mongoose } from "mongoose";

const TrainRequestSchema = new mongoose.Schema({
    trainNumber: String,
    boardingStation: String,
    trainDate: Date,
    userPhone: String,
  });
  
  const TrainRequest = mongoose.model('TrainRequest', TrainRequestSchema);