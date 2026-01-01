const multer = require('multer');
const { uploadToS3, uploadBase64ToS3 } = require('../utils/uploadToS3');

// Configure multer for memory storage (we'll upload directly to S3)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
  },
});

/**
 * Upload single image file
 */
exports.uploadSingleImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      const subfolder = req.body.subfolder || 'materials';
      const imageUrl = await uploadToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        subfolder
      );

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        imageUrl,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message,
      });
    }
  },
];

/**
 * Upload multiple image files
 */
exports.uploadMultipleImages = [
  upload.array('images', 10), // Max 10 images
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided',
        });
      }

      const subfolder = req.body.subfolder || 'materials';
      const uploadPromises = req.files.map((file) =>
        uploadToS3(file.buffer, file.originalname, file.mimetype, subfolder)
      );

      const imageUrls = await Promise.all(uploadPromises);

      res.json({
        success: true,
        message: 'Images uploaded successfully',
        imageUrls,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message,
      });
    }
  },
];

/**
 * Upload base64 image
 */
exports.uploadBase64Image = async (req, res) => {
  try {
    const { base64String, subfolder } = req.body;

    if (!base64String) {
      return res.status(400).json({
        success: false,
        message: 'Base64 string is required',
      });
    }

    const imageUrl = await uploadBase64ToS3(base64String, subfolder || 'materials');

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

/**
 * Upload multiple base64 images
 */
exports.uploadMultipleBase64Images = async (req, res) => {
  try {
    const { base64Strings, subfolder } = req.body;

    if (!base64Strings || !Array.isArray(base64Strings) || base64Strings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Base64 strings array is required',
      });
    }

    const uploadPromises = base64Strings.map((base64String) =>
      uploadBase64ToS3(base64String, subfolder || 'materials')
    );

    const imageUrls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      imageUrls,
    });
  } catch (error) {
    console.error('Error uploading base64 images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
};

