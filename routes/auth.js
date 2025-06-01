const express = require('express');
const router = express.Router();  // Corrected router initialization
const { signup, login } = require('../../controller/authController');

// POST /register route for user signup
router.post('/register', signup);  // Passed the signup function here

// POST /login route for user login
router.post('/login', login);  // Added the login route as well

module.exports = router;  // Corrected the export statement
