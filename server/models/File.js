const mongoose = require('mongoose');
const User = require('../models/User.js');  // Replace with the actual path to your User model file

// Define the schema for the File model
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  uploadDate: { type: Date, default: Date.now }, 
  expiryDate: { type: Date,  default: () => Date.now() + 24 * 60 * 60 * 1000  }, 

  maxDownload :  { type: Number, default: 0 },
  downloadCount : { type: Number, default: 0 },
  downloadId : { type: String, default: '' },
  uuid: {
    type: String,
    required: true,
    unique: true
  },
});

// Create the File model
const File = mongoose.model('File', fileSchema);

module.exports = File;
