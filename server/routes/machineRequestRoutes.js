const express = require('express');
const router = express.Router();
const machineRequestController = require('../controllers/machineRequestController');

router.post('/', machineRequestController.createRequest);
router.get('/verify/:requestId', machineRequestController.verifyRequest);

module.exports = router;

