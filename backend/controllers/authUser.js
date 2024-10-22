import {userModel} from '../Model/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { validationResult } from 'express-validator';
import twilio from 'twilio';
dotenv.config()

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone } = req.body;

  try {
    let user = await userModel.findOne({ ph_num:phone });
    if (!user) {
      return res.status(400).json({ msg: 'User Not exists' });
    }
    // Send verification code via Twilio
    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: 'sms' });

    res.status(200).json({ msg: 'Verification code sent'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Your Side Server error');
  }
};


export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone } = req.body;

  try {
    let user = await userModel.findOne({ ph_num:phone });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    // Send verification code via Twilio
    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: 'sms' });
      user = new userModel({
        name:name,
        ph_num:phone,
      });
      await user.save();
    res.status(200).json({ msg: 'Verification code sent'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Your Side Server error');
  }
};

export const verify = async (req, res) => {
  const { phone, code} = req.body;

  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({ to: phone, code });
    if (verificationCheck.status === 'approved') {
      let user = await userModel.findOneAndUpdate({ ph_num:phone }, { isVerified: true });
      
      const payload = {
        user: {
          _id : user._id,
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } else {
      res.status(400).json({ msg: 'Invalid verification code' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Your Side Server error');
  }
};

export const verifiedUser = (phone) => {
    let user = userModel.findOne({ph_num : phone})
    if(user.isVerified === true){
      return true
    }
    return false
}

export const userName = (req,res) => {
  const {phone} = req.body
  try{ 
  let user = userModel.findOne({ph_num : phone})
  if(user){
    res.status(200).json({name})
  }
  }catch(err){
    res.status(500).send('Your Server Side Error')
  }
}
