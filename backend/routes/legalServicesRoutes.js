const express = require('express');
const router = express.Router();
const legalServicesController = require('../controllers/legalServicesController');

router.get('/search', legalServicesController.searchServices);
router.get('/authorities', legalServicesController.getAuthorities);
router.post('/ask', legalServicesController.askAI);
router.get('/:serviceType', legalServicesController.getServiceByType);
router.get('/', legalServicesController.getAllServices);

module.exports = router;
