require('dotenv').config();

const express = require('express');


const app = express();
const fileRoutes = require('./routes/fileRouter.js');



// Import the auth routes
const authRouter = require('./routes/auth.js');  // Import the router from the correct path

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB setup and connection
const mongoose = require('mongoose');
const connectDb = require('./config/db.js');

// Connect to the database
connectDb();

// Use the authRouter for routes related to authentication
app.use('/auth', authRouter);  // Prefix all auth-related routes with /auth
app.use('/api/file', fileRoutes);

// Set up the port
const PORT = process.env.PORT || 5000;

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server only after connecting to the DB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
