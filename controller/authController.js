const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Controller
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Optionally generate a JWT token after user creation
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || 'your_secret_key',  // Use environment variable for secret
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send response with token and user info
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      },
      token // Return the generated token
    });

  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "bharatkhatwani",  // Use environment variable for secret
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send response with user info and token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token // Return the generated token
    });

  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login };
