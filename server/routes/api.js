const express = require('express');
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');

const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error('Error: File upload only supports the following filetypes - ' + filetypes)
    );
  },
});

// Route to analyze food image and generate recipe
router.post('/analyze-image', upload.single('image'), imageController.analyzeImage);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
