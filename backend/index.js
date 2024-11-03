// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

// Import route handlers
import authRoutes from './routes/userAuth.js';
import checkTrains from './routes/checkTrains.js';
import connectDB from './config/database.js'; // Firebase connection
import Booking from './routes/automation.js';

// Load environment variables
dotenv.config();
console.log(`Port: ${process.env.PORT}`); // Log the port to check if it's loaded correctly

// Initialize Express app
const app = express();
app.use(cors()); // Enable CORS

// Middleware
app.use(bodyParser.json());

// Basic route to check API status
app.get('/', (req, res) => {
  res.send("API is Working");
});

// Routes
app.use('/api/userAuth', authRoutes);
app.use('/api/trains', checkTrains);
app.use('/api/booking', Booking);

// Initialize Firebase connection
connectDB();

// Set port from environment or default to 80
const PORT = process.env.PORT || 80;

// Create and start HTTP server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});

// Internal ping every 10 minutes to keep server active
setInterval(() => {
  fetch(`http://localhost:${PORT}/`) // Adjust to your server’s URL if deployed
    .then(response => response.text())
    .then(data => console.log("Keep-alive ping successful: ", data))
    .catch(error => console.error("Keep-alive ping failed: ", error));
}, 600000); // 600,000 ms = 10 minutes
