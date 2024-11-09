import mongoose, { Mongoose } from "mongoose";
const PassengerSchema = new mongoose.Schema({
  name: { 
      type: String, 
      required: true, 
      maxlength: 16, // Maximum length of 16 characters
  },
  age: { 
      type: String, 
      required: true, 
      min: 5, 
      max: 125 
  },
  sex: { 
      type: String, 
      required: true, 
      enum: ['M', 'F'] // Acceptable values
  },
  food: { 
      type: String, 
      default : "", 
      enum: ["V", "N", "D",""] // Food choices
  },
  berth: { 
      type: String, 
      enum: ['LB', 'UB', 'SL', 'SU', 'MB', 'WS'], 
      default: null // Optional parameter with a default value
  },
  country: { 
      type: String, 
      default: 'IN' // ISO Country Code defaults to IN
  },
  coach: { 
      type: String 
  }
}, { _id: false }); 



// Define the Train Booking Schema
const TrainBookingSchema = new mongoose.Schema({
  UPI: { 
      type: String, 
      required: true, 
      minlength: 3, 
      validate: {
          validator: function(v) {
              // Check if it contains '@' and is an active UPI ID
              return /^[\w.-]+@[\w.-]+$/.test(v); // Regex for basic UPI format
          },
          message: props => `${props.value} is not a valid UPI ID!`
      }
  },
  class: { 
      type: String, 
      required: true, 
      enum: ['2A', '3A', 'SL', 'CC', '2S', 'FC', '1A', '3E'], 
      minlength: 2,
      maxlength: 4 
  },
  quota: { 
      type: String, 
      required: true, 
      minlength: 2, 
      enum: ['GN', 'TQ', 'PT'] // Valid quotas
  },
  train_number: { 
      type: String, 
      required: true, 
      minlength: 5, 
      maxlength: 5 // Train number length
  },
  from: { 
      type: String, 
      required: true, 
      // Add a custom validator to match existing station codes
  },
  to: { 
      type: String, 
      required: true, 
      // Add a custom validator to match existing station codes
  },
  journey_date: { 
      type: String, 
      required: true, 
      validate: {
          validator: function(v) {
              // Validate the date format YYYYMMDD
              return /^\d{8}$/.test(v);
          },
          message: props => `${props.value} is not a valid journey date!`
      }
  },
  mobile_number: { 
      type: String, 
      required: true, 
      length: 10,
      validate: {
          validator: function(v) {
              // Validate the length and if it's an active Indian mobile number
              return /^\d{10}$/.test(v); // Regex for 10 digit mobile number
          },
          message: props => `${props.value} is not a valid mobile number!`
      }
  },
  userID: { 
      type: String, 
      required: true 
  },
  password: { 
      type: String, 
      required: true 
  },
  passengers: { 
      type: [PassengerSchema], 
      validate: {
          validator: function(v) {
              // Validate the number of passengers based on booking type
              const bookingType = this.quota; // Example: get quota from the booking
              if (bookingType === 'GN') {
                  return v.length <= 6; // Maximum 6 for General
              } else if (bookingType === 'TQ' || bookingType === 'PT') {
                  return v.length <= 4; // Maximum 4 for Tatkal and Premium Tatkal
              }
              return true; // No restriction for other quotas
          },
          message: props => `Passengers list exceeds limit based on quota!`
      }
  },
  isCompleted : {
    required : true,
    default : false,
    type : Boolean,
  },
  isBooked : {
    required : true,
    default : false,
    type : Boolean,
  }
});

export const bookingModel = mongoose.model.bookingModel || mongoose.model('TrainBooking',TrainBookingSchema);

const TrainChartStationSchema = new mongoose.Schema({
  trainNumber : {type : String,required: true},
  stations : {type : [String],required: true}
})

export const TrainChartStationModel = mongoose.model.TrainChartStation || mongoose.model('TrainChartStation', TrainChartStationSchema);