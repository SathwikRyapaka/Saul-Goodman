const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/voice', aiController.processVoiceQuery); // Keep voice public or protect? The user only specified case, summary, and document. We'll leave voice public for now unless it returns case data.
router.post('/summarize', protect, aiController.summarizeDocument);
router.post('/case/:id/explain', protect, aiController.explainMongoDB_Case);

module.exports = router;
