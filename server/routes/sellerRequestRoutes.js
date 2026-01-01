const express = require('express');
const router = express.Router();
const sellerRequestController = require('../controllers/sellerRequestController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.post('/', sellerRequestController.createSellerRequest);

router.get('/', protect, isAdmin, sellerRequestController.getAllSellerRequests);

router.put('/:id', protect, isAdmin, sellerRequestController.updateSellerRequest);

router.delete('/:id', protect, isAdmin, sellerRequestController.deleteSellerRequest);

module.exports = router;
