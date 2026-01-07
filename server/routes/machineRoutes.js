const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.get('/', machineController.getMachines);
router.get('/:id', machineController.getMachineById);

router.post('/', protect, isAdmin, machineController.createMachine);
router.put('/:id', protect, isAdmin, machineController.updateMachine);
router.delete('/:id', protect, isAdmin, machineController.deleteMachine);

module.exports = router;

