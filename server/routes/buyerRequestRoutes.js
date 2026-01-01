const express = require('express');
const router = express.Router();
const buyerRequestController = require('../controllers/buyerRequestController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.post('/', buyerRequestController.createRequest);
router.get('/verify/:requestId', buyerRequestController.verifyRequest);

router.get('/', protect, isAdmin, buyerRequestController.getAllRequests);
router.get('/export', protect, isAdmin, buyerRequestController.exportRequests);
router.get('/:id', protect, isAdmin, buyerRequestController.getRequestById);
router.patch('/:id/status', protect, isAdmin, buyerRequestController.updateRequestStatus);
router.post('/:id/notes', protect, isAdmin, buyerRequestController.addAdminNote);

module.exports = router;
