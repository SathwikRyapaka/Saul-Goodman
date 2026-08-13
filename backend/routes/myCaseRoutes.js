const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addCase,
  getMyCases,
  removeCase,
  checkCases
} = require('../controllers/myCaseController');

// All my-cases routes must be protected
router.use(protect);

router.post('/', addCase);
router.get('/', getMyCases);
router.delete('/:caseId', removeCase);
router.post('/check', checkCases);

module.exports = router;
