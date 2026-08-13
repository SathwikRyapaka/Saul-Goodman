const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/voice', aiController.processVoiceQuery);
router.post('/summarize', aiController.summarizeDocument);

module.exports = router;
