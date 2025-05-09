const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controller/fileController.js');
const upload = require('../middlewares/upload.js');
const authMiddleware = require('../middlewares/auth'); // If you're using authentication

// Route for file upload (authentication required)
router.post('/upload',authMiddleware,  upload.single('file'), uploadFile);

// Route for file retrieval (shareable download link)
router.get('/download/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send the file as a download
    res.download(file.path, file.filename);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
