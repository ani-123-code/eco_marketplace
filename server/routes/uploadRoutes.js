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

// Test endpoint to check image URL accessibility (no auth required for debugging)
router.get('/test-image/:url*', async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.params.url + (req.params[0] || ''));
    console.log(`🧪 Testing image URL: ${imageUrl}`);
    
    // Try to fetch the image
    const https = require('https');
    const http = require('http');
    
    const parsedUrl = new URL(imageUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    client.get(imageUrl, (response) => {
      const statusCode = response.statusCode;
      const contentType = response.headers['content-type'];
      
      console.log(`📊 Image test result: ${statusCode} - ${contentType}`);
      
      res.json({
        success: statusCode === 200,
        statusCode,
        contentType,
        url: imageUrl,
        headers: response.headers,
        message: statusCode === 200 
          ? 'Image is accessible' 
          : `Image returned status ${statusCode}`
      });
    }).on('error', (error) => {
      console.error(`❌ Image test error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message,
        url: imageUrl
      });
    });
  } catch (error) {
    console.error('Error testing image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

