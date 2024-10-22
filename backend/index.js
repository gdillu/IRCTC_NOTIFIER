import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import authRoutes from './routes/userAuth.js';
import checkTrains from './routes/checkTrains.js';
import connectDB from './config/userdb.js';
import Booking from './routes/automation.js';
import cors from "cors"
// Load environment variables
dotenv.config();
console.log(process.env.PORT);

const app = express();
app.use(cors())
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/userAuth', authRoutes);
app.use('/api/trains', checkTrains);
app.use('/api/Booking', Booking);

// Database connection
connectDB();

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

