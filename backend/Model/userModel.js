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
    username:{
        type : String,
    },
    password:{
        type : String,
    },
})

export const userModel = mongoose.models.user  || mongoose.model("user",userSchema);
