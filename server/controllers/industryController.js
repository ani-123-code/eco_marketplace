const Industry = require('../models/Industry');
const Material = require('../models/Material');
const { uploadBase64ToS3 } = require('../utils/uploadToS3');

exports.getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .select('-__v');

    const industriesWithCounts = await Promise.all(
      industries.map(async (industry) => {
        const materialCount = await Material.countDocuments({
          industry: industry._id,
          isActive: true
        });
        return {
          ...industry.toObject(),
          materialCount
        };
      })
    );

    res.json({
      success: true,
      industries: industriesWithCounts
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching industries',
      error: error.message
    });
  }
};

exports.getIndustryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const industry = await Industry.findOne({ slug, isActive: true });

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    const materials = await Material.find({
      industry: industry._id,
      isActive: true
    })
      .select('_id name materialCode images availableQuantity unit isFeatured')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      industry: {
        ...industry.toObject(),
        materials
      }
    });
  } catch (error) {
    console.error('Error fetching industry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching industry',
      error: error.message
    });
  }
};

exports.createIndustry = async (req, res) => {
  try {
    const { name, description, icon, displayOrder } = req.body;

    const existingIndustry = await Industry.findOne({ name });
    if (existingIndustry) {
      return res.status(400).json({
        success: false,
        message: 'Industry with this name already exists'
      });
    }

    let iconUrl = icon;
    // Process icon: if base64, upload to S3; if already URL, use it
    if (icon && typeof icon === 'string' && icon.startsWith('data:image')) {
      try {
        iconUrl = await uploadBase64ToS3(icon, 'industries');
      } catch (error) {
        console.error('Error uploading icon to S3:', error);
        // If upload fails, set to empty string
        iconUrl = '';
      }
    }

    const industry = new Industry({
      name,
      description,
      icon: iconUrl,
      displayOrder: displayOrder || 0
    });

    await industry.save();

    res.status(201).json({
      success: true,
      message: 'Industry created successfully',
      industry
    });
  } catch (error) {
    console.error('Error creating industry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating industry',
      error: error.message
    });
  }
};

exports.updateIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Process icon: if base64, upload to S3; if already URL, use it
    if (updates.icon && typeof updates.icon === 'string' && updates.icon.startsWith('data:image')) {
      try {
        updates.icon = await uploadBase64ToS3(updates.icon, 'industries');
      } catch (error) {
        console.error('Error uploading icon to S3:', error);
        // If upload fails, skip icon update
        delete updates.icon;
      }
    }

    const industry = await Industry.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    res.json({
      success: true,
      message: 'Industry updated successfully',
      industry
    });
  } catch (error) {
    console.error('Error updating industry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating industry',
      error: error.message
    });
  }
};

exports.deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;

    const materialCount = await Material.countDocuments({ industry: id });
    if (materialCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete industry with ${materialCount} materials. Please reassign or delete materials first.`
      });
    }

    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    res.json({
      success: true,
      message: 'Industry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting industry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting industry',
      error: error.message
    });
  }
};

exports.toggleIndustryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const industry = await Industry.findById(id);
    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    industry.isActive = !industry.isActive;
    await industry.save();

    res.json({
      success: true,
      message: `Industry ${industry.isActive ? 'activated' : 'deactivated'} successfully`,
      industry
    });
  } catch (error) {
    console.error('Error toggling industry status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling industry status',
      error: error.message
    });
  }
};
