import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    ph_num : {
        type : String,
        required : true,
        unique : true,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    selectedTrains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TrainNotification' }]
})

export const userModel = mongoose.models.user  || mongoose.model("user",userSchema);

const TrainNotificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainNumber: { type: String, required: true },
    boardingStation: { type: String, required: true },
    startTime : {type: String},
    travelDate: { type: Date, required: true },
    notified: { type: Boolean, default: false },
  });

export const notificationModel = mongoose.models.notification || mongoose.model("notification",TrainNotificationSchema)

const TrainChartStationSchema = new mongoose.Schema({
    trainNumber : {type : String,required: true},
    stations : {type : [String],required: true}
})

export const TrainChartStationModel = mongoose.model.TrainChartStation || mongoose.model('TrainChartStation', TrainChartStationSchema);