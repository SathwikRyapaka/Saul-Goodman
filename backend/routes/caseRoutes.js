const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

router.get('/', caseController.getCases);
router.get('/:id', caseController.getCaseById);
router.post('/', caseController.createCase);

module.exports = router;
