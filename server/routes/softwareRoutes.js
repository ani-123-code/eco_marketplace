const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/softwareController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.get('/', softwareController.getSoftware);
router.get('/:id', softwareController.getSoftwareById);

router.post('/', protect, isAdmin, softwareController.createSoftware);
router.put('/:id', protect, isAdmin, softwareController.updateSoftware);
router.delete('/:id', protect, isAdmin, softwareController.deleteSoftware);

module.exports = router;

