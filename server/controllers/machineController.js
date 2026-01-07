const Machine = require('../models/Machine');
const Industry = require('../models/Industry');
const { uploadBase64ToS3 } = require('../utils/uploadToS3');

exports.getMachines = async (req, res) => {
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
        { machineCode: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [machines, total] = await Promise.all([
      Machine.find(query)
        .populate('industry', 'name slug')
        .select('-__v')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Machine.countDocuments(query)
    ]);

    res.json({
      success: true,
      machines,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching machines',
      error: error.message
    });
  }
};

exports.getMachineById = async (req, res) => {
  try {
    const { id } = req.params;

    const machine = await Machine.findById(id)
      .populate('industry', 'name slug description');

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found'
      });
    }

    const relatedMachines = await Machine.find({
      industry: machine.industry._id,
      _id: { $ne: machine._id },
      isActive: true
    })
      .select('_id name machineCode images availability')
      .limit(4);

    res.json({
      success: true,
      machine,
      relatedMachines
    });
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching machine',
      error: error.message
    });
  }
};

exports.createMachine = async (req, res) => {
  try {
    const machineData = { ...req.body };

    const industry = await Industry.findById(machineData.industry);
    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    // Process images: if base64, upload to S3; if already URLs, use them
    if (machineData.images && Array.isArray(machineData.images)) {
      const processedImages = await Promise.all(
        machineData.images.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('data:image')) {
            try {
              return await uploadBase64ToS3(image, 'machines');
            } catch (error) {
              console.error('Error uploading image to S3:', error);
              return null;
            }
          }
          return image;
        })
      );
      machineData.images = processedImages.filter(img => img !== null);
    }

    const machine = new Machine(machineData);
    await machine.save();

    await machine.populate('industry', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Machine created successfully',
      machine
    });
  } catch (error) {
    console.error('Error creating machine:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating machine',
      error: error.message
    });
  }
};

exports.updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Process images: if base64, upload to S3; if already URLs, use them
    if (updates.images && Array.isArray(updates.images)) {
      const processedImages = await Promise.all(
        updates.images.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('data:image')) {
            try {
              return await uploadBase64ToS3(image, 'machines');
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

    const machine = await Machine.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('industry', 'name slug');

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found'
      });
    }

    res.json({
      success: true,
      message: 'Machine updated successfully',
      machine
    });
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating machine',
      error: error.message
    });
  }
};

exports.deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;

    const machine = await Machine.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found'
      });
    }

    res.json({
      success: true,
      message: 'Machine deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting machine',
      error: error.message
    });
  }
};

