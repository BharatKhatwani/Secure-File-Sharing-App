const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const File = require('../models/File');
const { v4: uuidv4 } = require('uuid');

// Upload Controller
const uploadFileToCloudinary = async (req, res) => {
  try {
    const localPath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'secure-drop'
    });

    // Delete local file after upload
    fs.unlinkSync(localPath);

    const fileUUID = uuidv4();
    const fileExpiryDuration = req.body.expiryDuration || 24 * 60 * 60 * 1000; // Default to 24 hours

    // Calculate the expiry date (current time + expiry duration)
    const expiryDate = new Date(Date.now() + fileExpiryDuration);

    // Save metadata in DB
    const file = new File({
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId: req.user.id, // Assuming auth middleware
      uploadDate: new Date(),
      path: result.secure_url,
      downloadId: result.public_id,
      uuid: fileUUID,
      expiryDate: expiryDate // Correctly set as a Date object
    });

    await file.save();

    res.status(200).json({
      message: 'Uploaded to Cloudinary',
      url: result.secure_url,
      uuid: fileUUID,
      public_id: result.public_id, 
      expiryDate: expiryDate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Download Controller
const downloadFile = async (req, res) => {
  try {
    // Step 1: Fetch the file from the database
    const file = await File.findOne({ uuid: req.params.uuid });

    // Check if the file exists
    if (!file) {
      return res.status(404).json({ message: 'File not found or invalid link' });
    }

    console.log("File found:", file);  // Log the file object to verify

    // Step 2: Check if the file has expired
    const now = new Date();
    if (file.expiryDate && file.expiryDate < now) {
      console.log("File has expired:", file.filename);
      return res.status(410).json({ message: 'This link has expired' });
    }

    // Step 3: Check if the download count exceeds the max limit
    if (file.maxDownload > 0 && file.downloadCount >= file.maxDownload) {
      console.log("Download limit reached for file:", file.filename);
      return res.status(403).json({ message: 'Download limit reached' });
    }

    // Step 4: Increment the download count and save the updated file object
    file.downloadCount += 1;
    console.log("Incremented download count:", file.downloadCount);  // Log updated download count
    await file.save();

    // Step 5: Check if file.path exists (i.e., Cloudinary URL is valid)
    if (!file.path || file.path === '') {
      console.error("File path is not valid for download");
      return res.status(500).json({ message: 'File path not valid for download' });
    }

    // Step 6: Redirect to Cloudinary URL for download
    return res.redirect(file.path);  // Cloudinary URL

  } catch (err) {
    console.error("Error during file download:", err);
    res.status(500).json({ message: 'Server error during download' });
  }
};


module.exports = { uploadFileToCloudinary, downloadFile };
