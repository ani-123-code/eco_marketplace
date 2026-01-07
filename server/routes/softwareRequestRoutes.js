const express = require('express');
const router = express.Router();
const softwareRequestController = require('../controllers/softwareRequestController');

router.post('/', softwareRequestController.createRequest);
router.get('/verify/:requestId', softwareRequestController.verifyRequest);

module.exports = router;

