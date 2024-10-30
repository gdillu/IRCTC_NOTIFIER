import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/userAuth.js';
import checkTrains from './routes/checkTrains.js';
import connectDB from './config/database.js'; // Firebase connection
import Booking from './routes/automation.js';

// Load environment variables
dotenv.config();
console.log(process.env.PORT);

const app = express();
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.get('/',(req,res)=>{
  res.send("API is Working")
})
// Routes
app.use('/api/userAuth', authRoutes);
app.use('/api/trains', checkTrains);
app.use('/api/Booking', Booking);
// This will initialize Firebase
connectDB()
// SSL/TLS Certificates
// const key = fs.readFileSync('key.pem');
// const cert = fs.readFileSync('cert.pem');
// const options = { key, cert };

// // Start the HTTPS server
// const PORT = process.env.PORT || 443;
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`HTTPS Server running on https://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 80;
http.createServer(app).listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});
