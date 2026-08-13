const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, caseController.searchCases);
router.get('/:id', protect, caseController.getCaseById);
router.get('/cnr/:cnr', protect, caseController.getCaseByCnr);
router.get('/number/:caseNumber', protect, caseController.getCaseByNumber);

module.exports = router;
