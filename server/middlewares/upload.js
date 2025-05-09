const multer = require('multer');
const path = require('path');

// Setup storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + '-' + file.originalname); // Create a unique filename
  },
});

// Initialize Multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
