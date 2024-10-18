import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/userAuth.js';
import checkTrains from './routes/checkTrains.js'
import connectDB from './config/userdb.js';

// Load environment variables
dotenv.config();
console.log(process.env.PORT)
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/userAuth', authRoutes);
app.use('/api/trains',checkTrains);
// Database connection
connectDB();

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
