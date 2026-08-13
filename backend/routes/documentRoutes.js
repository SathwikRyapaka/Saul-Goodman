const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadAndProcess, getSummary } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for memory storage, 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error("Please upload a valid PDF document."));
    }
  }
});

router.post('/upload', protect, upload.single('file'), uploadAndProcess);
router.get('/:id/summary', protect, getSummary);

module.exports = router;
