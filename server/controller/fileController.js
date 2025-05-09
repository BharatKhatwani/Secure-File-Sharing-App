const File = require('../models/File');

// Handle file upload and metadata saving
const uploadFile = async (req, res) => {
  try {
    // Check if the file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }


    console.log(req.user.id)
    // Store the file metadata in MongoDB
    const fileData = new File({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      
      userId: req.user.id,  // Assuming the user is authenticated
    });

    // Save to MongoDB
    await fileData.save();

    // Respond with the file metadata
    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { uploadFile };
