const Material = require('../models/Material');
const Industry = require('../models/Industry');
const { uploadBase64ToS3 } = require('../utils/uploadToS3');

exports.getMaterials = async (req, res) => {
  try {
    const {
      industry,
      filters,
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
        { materialCode: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (filters) {
      try {
        const parsedFilters = JSON.parse(filters);
        Object.entries(parsedFilters).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            query[`attributes.${key}.value`] = { $in: value };
          } else if (typeof value === 'object' && value !== null && value.min !== undefined) {
            query[`attributes.${key}.value`] = {
              $gte: value.min,
              $lte: value.max
            };
          } else if (value !== null && value !== '') {
            query[`attributes.${key}.value`] = value;
          }
        });
      } catch (error) {
        console.error('Error parsing filters:', error);
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [materials, total] = await Promise.all([
      Material.find(query)
        .populate('industry', 'name slug')
        .select('-__v')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Material.countDocuments(query)
    ]);

    const availableFilters = query.industry
      ? await generateFiltersForIndustry(query.industry)
      : [];

    res.json({
      success: true,
      materials,
      filters: availableFilters,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching materials',
      error: error.message
    });
  }
};

async function generateFiltersForIndustry(industryId) {
  const materials = await Material.find({
    industry: industryId,
    isActive: true
  });

  const filterMap = new Map();

  materials.forEach(material => {
    if (material.attributes) {
      material.attributes.forEach((attrValue, attrKey) => {
        if (attrValue.filterEnabled) {
          if (!filterMap.has(attrKey)) {
            filterMap.set(attrKey, {
              key: attrKey,
              label: attrValue.label,
              type: attrValue.type,
              unit: attrValue.unit || '',
              options: new Set()
            });
          }

          const filter = filterMap.get(attrKey);

          if (attrValue.type === 'select' || attrValue.type === 'multiselect') {
            if (Array.isArray(attrValue.value)) {
              attrValue.value.forEach(v => filter.options.add(v));
            } else if (attrValue.value) {
              filter.options.add(attrValue.value);
            }
          } else if (attrValue.type === 'range' || attrValue.type === 'number') {
            if (!filter.min || attrValue.value < filter.min) {
              filter.min = attrValue.value;
            }
            if (!filter.max || attrValue.value > filter.max) {
              filter.max = attrValue.value;
            }
          }
        }
      });
    }
  });

  return Array.from(filterMap.values()).map(filter => ({
    ...filter,
    options: filter.options ? Array.from(filter.options).sort() : undefined
  }));
}

exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id)
      .populate('industry', 'name slug description');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    const relatedMaterials = await Material.find({
      industry: material.industry._id,
      _id: { $ne: material._id },
      isActive: true
    })
      .select('_id name materialCode images availableQuantity unit')
      .limit(4);

    res.json({
      success: true,
      material,
      relatedMaterials
    });
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching material',
      error: error.message
    });
  }
};

exports.getFiltersForIndustry = async (req, res) => {
  try {
    const { industrySlug } = req.params;

    const industry = await Industry.findOne({ slug: industrySlug, isActive: true });
    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    const filters = await generateFiltersForIndustry(industry._id);

    res.json({
      success: true,
      filters
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filters',
      error: error.message
    });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const materialData = { ...req.body };

    const industry = await Industry.findById(materialData.industry);
    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found'
      });
    }

    // Process images: if base64, upload to S3; if already URLs, use them
    if (materialData.images && Array.isArray(materialData.images)) {
      const processedImages = await Promise.all(
        materialData.images.map(async (image) => {
          // Check if it's a base64 string
          if (typeof image === 'string' && image.startsWith('data:image')) {
            try {
              // Upload base64 to S3
              return await uploadBase64ToS3(image, 'materials');
            } catch (error) {
              console.error('Error uploading image to S3:', error);
              // If upload fails, skip this image or return original
              return null;
            }
          }
          // Already a URL, use it
          return image;
        })
      );
      // Filter out null values (failed uploads)
      materialData.images = processedImages.filter(img => img !== null);
    }

    const material = new Material(materialData);
    await material.save();

    await material.populate('industry', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      material
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating material',
      error: error.message
    });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Process images: if base64, upload to S3; if already URLs, use them
    if (updates.images && Array.isArray(updates.images)) {
      const processedImages = await Promise.all(
        updates.images.map(async (image) => {
          // Check if it's a base64 string
          if (typeof image === 'string' && image.startsWith('data:image')) {
            try {
              // Upload base64 to S3
              return await uploadBase64ToS3(image, 'materials');
            } catch (error) {
              console.error('Error uploading image to S3:', error);
              // If upload fails, skip this image or return original
              return null;
            }
          }
          // Already a URL, use it
          return image;
        })
      );
      // Filter out null values (failed uploads)
      updates.images = processedImages.filter(img => img !== null);
    }

    const material = await Material.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('industry', 'name slug');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      message: 'Material updated successfully',
      material
    });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating material',
      error: error.message
    });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      message: 'Material deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting material',
      error: error.message
    });
  }
};

exports.adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { operation, quantity } = req.body;

    if (!['add', 'subtract', 'set'].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use "add", "subtract", or "set"'
      });
    }

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    if (operation === 'add') {
      material.availableQuantity += quantity;
    } else if (operation === 'subtract') {
      material.availableQuantity = Math.max(0, material.availableQuantity - quantity);
    } else if (operation === 'set') {
      material.availableQuantity = Math.max(0, quantity);
    }

    material.updatedAt = Date.now();
    await material.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      material
    });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error adjusting stock',
      error: error.message
    });
  }
};

exports.updateAttributes = async (req, res) => {
  try {
    const { id } = req.params;
    const { attributeKey, label, value, type, unit, filterEnabled } = req.body;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    if (!material.attributes) {
      material.attributes = new Map();
    }

    material.attributes.set(attributeKey, {
      label,
      value,
      type,
      unit: unit || '',
      filterEnabled: filterEnabled || false
    });

    material.updatedAt = Date.now();
    await material.save();

    res.json({
      success: true,
      message: 'Attribute updated successfully',
      material
    });
  } catch (error) {
    console.error('Error updating attributes:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating attributes',
      error: error.message
    });
  }
};
