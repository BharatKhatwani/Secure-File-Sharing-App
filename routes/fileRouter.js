const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.js');
const { uploadFileToCloudinary, downloadFile } = require('../controller/fileController.js');
const authMiddleware= require('../middlewares/auth.js')

router.post('/upload', authMiddleware, upload.single('file'), uploadFileToCloudinary);
router.get('/download/:uuid', downloadFile);

module.exports = router;
