const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const File = require('../models/File'); // Your MongoDB schema
const { v4: uuidv4 } = require('uuid'); // Fix: use require, not import

const uploadFileToCloudinary = async (req, res) => {
  try {
    const localPath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'secure-drop'
    });

    // Delete local file after upload
    fs.unlinkSync(localPath);

    const fileUUID = uuidv4(); // ✅ Generate UUID

    // Save metadata in DB
    const file = new File({
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId: req.user.id, // assuming auth middleware
      uploadDate: new Date(),
      path: result.secure_url,
      downloadId: result.public_id,
      uuid: fileUUID // ✅ Store UUID
    });

    await file.save();

    res.status(200).json({ 
      message: 'Uploaded to Cloudinary',
      url: result.secure_url,
      uuid: fileUUID, // ✅ Return UUID so frontend can use download link
      public_id: result.public_id 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) return res.status(404).json({ message: 'Link expired or file not found' });

    return res.redirect(file.path); // for Cloudinary hosted files
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadFileToCloudinary, downloadFile };
