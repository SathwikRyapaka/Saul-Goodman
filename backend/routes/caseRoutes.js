const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

router.get('/search', caseController.searchCases);
router.get('/:id', caseController.getCaseById);
router.get('/cnr/:cnr', caseController.getCaseByCnr);
router.get('/number/:caseNumber', caseController.getCaseByNumber);

module.exports = router;
