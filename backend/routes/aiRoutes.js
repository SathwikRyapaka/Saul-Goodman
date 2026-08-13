const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/voice', aiController.processVoiceQuery);
router.post('/summarize', aiController.summarizeDocument);
router.post('/case/:id/explain', aiController.explainMongoDB_Case);

module.exports = router;
