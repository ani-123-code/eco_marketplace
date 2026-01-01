const BuyerRequest = require('../models/BuyerRequest');
const Material = require('../models/Material');
const { sendEmail } = require('../utils/emailService');

exports.createRequest = async (req, res) => {
  try {
    const {
      buyerName,
      buyerEmail,
      buyerMobile,
      countryCode,
      companyName,
      materialId,
      requestedQuantity,
      specifications
    } = req.body;

    if (!buyerName || !companyName || !materialId || !requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!buyerEmail && !buyerMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or mobile number'
      });
    }

    const material = await Material.findById(materialId).populate('industry');
    if (!material || !material.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Material not found or unavailable'
      });
    }

    if (requestedQuantity < material.minimumOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${material.minimumOrderQuantity} ${material.unit}`
      });
    }

    const buyerRequest = new BuyerRequest({
      buyerName,
      buyerEmail,
      buyerMobile,
      countryCode: countryCode || '+91',
      companyName,
      material: materialId,
      industry: material.industry._id,
      requestedQuantity,
      requestedUnit: material.unit,
      specifications: specifications || '',
      status: 'New'
    });

    await buyerRequest.save();
    await buyerRequest.populate(['material', 'industry']);

    // Send confirmation email to buyer
    if (buyerRequest.buyerEmail) {
      try {
        await sendEmail(
          buyerRequest.buyerEmail,
          'quoteRequest',
          {
            buyerName: buyerRequest.buyerName,
            companyName: buyerRequest.companyName,
            materialName: buyerRequest.material.name,
            materialCode: buyerRequest.material.materialCode,
            requestedQuantity: buyerRequest.requestedQuantity,
            unit: buyerRequest.requestedUnit,
            buyerEmail: buyerRequest.buyerEmail,
            buyerMobile: buyerRequest.buyerMobile,
            countryCode: buyerRequest.countryCode,
            specifications: buyerRequest.specifications,
            requestId: buyerRequest.requestId
          }
        );
      } catch (emailError) {
        console.error('Error sending quote request email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      requestId: buyerRequest.requestId,
      request: buyerRequest
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating request',
      error: error.message
    });
  }
};

exports.verifyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BuyerRequest.findOne({ requestId })
      .populate('material', 'name materialCode images')
      .populate('industry', 'name');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      request: {
        requestId: request.requestId,
        buyerName: request.buyerName,
        companyName: request.companyName,
        material: request.material,
        industry: request.industry,
        requestedQuantity: request.requestedQuantity,
        requestedUnit: request.requestedUnit,
        status: request.status,
        createdAt: request.createdAt
      }
    });
  } catch (error) {
    console.error('Error verifying request:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying request',
      error: error.message
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const {
      status,
      industry,
      material,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (industry) {
      query.industry = industry;
    }

    if (material) {
      query.material = material;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { requestId: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { buyerMobile: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [requests, total] = await Promise.all([
      BuyerRequest.find(query)
        .populate('material', 'name materialCode images availableQuantity unit')
        .populate('industry', 'name slug')
        .populate('adminNotes.addedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      BuyerRequest.countDocuments(query)
    ]);

    res.json({
      success: true,
      requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message
    });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BuyerRequest.findById(id)
      .populate('material')
      .populate('industry')
      .populate('adminNotes.addedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching request',
      error: error.message
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const validStatuses = ['New', 'Reviewed', 'Confirmed', 'Dispatched', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = await BuyerRequest.findById(id).populate('material');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (status === 'Confirmed' && request.status !== 'Confirmed' && !request.stockDeducted) {
      const material = request.material;

      if (material.availableQuantity < request.requestedQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock',
          available: material.availableQuantity,
          requested: request.requestedQuantity
        });
      }

      material.availableQuantity -= request.requestedQuantity;
      await material.save();

      request.stockDeducted = true;
      request.quantityFulfilled = request.requestedQuantity;
      request.confirmedAt = new Date();
    }

    request.status = status;

    if (adminNote && req.user) {
      request.adminNotes.push({
        note: adminNote,
        addedBy: req.user._id,
        addedAt: new Date()
      });
    }

    if (status === 'Dispatched' && !request.dispatchedAt) {
      request.dispatchedAt = new Date();
    }
    if (status === 'Completed' && !request.completedAt) {
      request.completedAt = new Date();
    }

    await request.save();
    await request.populate(['material', 'industry', 'adminNotes.addedBy']);

    res.json({
      success: true,
      message: 'Request updated successfully',
      request
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating request',
      error: error.message
    });
  }
};

exports.addAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !req.user) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const request = await BuyerRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.adminNotes.push({
      note,
      addedBy: req.user._id,
      addedAt: new Date()
    });

    await request.save();
    await request.populate('adminNotes.addedBy', 'name email');

    res.json({
      success: true,
      message: 'Note added successfully',
      request
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
};

exports.exportRequests = async (req, res) => {
  try {
    const { status, industry, startDate, endDate } = req.query;

    let query = {};
    if (status) query.status = status;
    if (industry) query.industry = industry;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const requests = await BuyerRequest.find(query)
      .populate('material', 'name materialCode')
      .populate('industry', 'name')
      .sort('-createdAt');

    const csvHeader = 'Request ID,Date,Buyer Name,Email,Mobile,Company,Material,Industry,Quantity,Unit,Status\n';
    const csvRows = requests.map(req =>
      `${req.requestId},${req.createdAt.toISOString().split('T')[0]},${req.buyerName},"${req.buyerEmail}",${req.countryCode}${req.buyerMobile},"${req.companyName}","${req.material?.name || 'N/A'}","${req.industry?.name || 'N/A'}",${req.requestedQuantity},${req.requestedUnit},${req.status}`
    ).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=buyer-requests-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting requests',
      error: error.message
    });
  }
};
