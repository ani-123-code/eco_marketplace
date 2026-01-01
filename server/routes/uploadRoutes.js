const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

// All upload routes require authentication and admin access
router.post('/image', protect, isAdmin, uploadController.uploadSingleImage);
router.post('/images', protect, isAdmin, uploadController.uploadMultipleImages);
router.post('/base64', protect, isAdmin, uploadController.uploadBase64Image);
router.post('/base64/multiple', protect, isAdmin, uploadController.uploadMultipleBase64Images);

module.exports = router;

