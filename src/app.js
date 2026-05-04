// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./Routes/userRoutes');  // Import the user routes
const errorHandler = require('./Middleware/errorHandler');  // Error handling middleware

const app = express();

// Middleware setup
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(express.static(path.join(__dirname, "../public")));  // Serve static files from the public directory

// Register routes
app.use('/api/users', userRoutes);  // Attach user routes to /api/users

// Serve the main index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;  // Export the app for serverless use