const Software = require('../models/Software');
const Industry = require('../models/Industry');
const { uploadBase64ToS3 } = require('../utils/uploadToS3');

exports.getSoftware = async (req, res) => {
  try {
    const {
      industry,
      page = 1,
      limit = 20,
      search,
      featured,
      sort = '-createdAt'
    } = req.query;

    let query = { isActive: true };

    if (industry) {
      const industryDoc = await Industry.findOne({ slug: industry });
      if (industryDoc) {
        query.industry = industryDoc._id;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { softwareCode: { $regex: search, $options: 'i' } },
        { developer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [software, total] = await Promise.all([
      Software.find(query)
        .populate('industry', 'name slug')
        .select('-__v')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Software.countDocuments(query)
    ]);

    res.json({
      success: true,
      software,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching software:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching software',
      error: error.message
    });
  }
};

exports.getSoftwareById = async (req, res) => {
  try {
    const { id } = req.params;

    const software = await Software.findById(id)
      .populate('industry', 'name slug description');

    if (!software) {
      return res.status(404).json({
        success: false,
        message: 'Software not found'
      });
    }

    const relatedSoftware = await Software.find({
      industry: software.industry._id,
      _id: { $ne: software._id },
      isActive: true
    })
      .select('_id name softwareCode images availability')
      .limit(4);

    res.json({
      success: true,
      software,
      relatedSoftware
    });
  } catch (error) {
    console.error('Error fetching software:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching software',
      error: error.message
    });
  }
};

exports.createSoftware = async (req, res) => {
  try {
    const softwareData = { ...req.body };

    const industry = await Industry.findById(softwareData.industry);
    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    // Process images: if base64, upload to S3; if already URLs, use them
    if (softwareData.images && Array.isArray(softwareData.images)) {
      const processedImages = await Promise.all(
        softwareData.images.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('data:image')) {
            try {
              return await uploadBase64ToS3(image, 'software');
            } catch (error) {
              console.error('Error uploading image to S3:', error);
              return null;
            }
          }
          return image;
        })
      );
      softwareData.images = processedImages.filter(img => img !== null);
    }

    const software = new Software(softwareData);
    await software.save();

    await software.populate('industry', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Software created successfully',
      software
    });
  } catch (error) {
    console.error('Error creating software:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating software',
      error: error.message
    });
  }
};

exports.updateSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Process images: if base64, upload to S3; if already URLs, use them
    if (updates.images && Array.isArray(updates.images)) {
      const processedImages = await Promise.all(
        updates.images.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('data:image')) {
            try {
              return await uploadBase64ToS3(image, 'software');
            } catch (error) {
              console.error('Error uploading image to S3:', error);
              return null;
            }
          }
          return image;
        })
      );
      updates.images = processedImages.filter(img => img !== null);
    }

    const software = await Software.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('industry', 'name slug');

    if (!software) {
      return res.status(404).json({
        success: false,
        message: 'Software not found'
      });
    }

    res.json({
      success: true,
      message: 'Software updated successfully',
      software
    });
  } catch (error) {
    console.error('Error updating software:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating software',
      error: error.message
    });
  }
};

exports.deleteSoftware = async (req, res) => {
  try {
    const { id } = req.params;

    const software = await Software.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!software) {
      return res.status(404).json({
        success: false,
        message: 'Software not found'
      });
    }

    res.json({
      success: true,
      message: 'Software deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting software:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting software',
      error: error.message
    });
  }
};

