const SoftwareRequest = require('../models/SoftwareRequest');
const Software = require('../models/Software');
const { sendEmail } = require('../utils/emailService');

exports.createRequest = async (req, res) => {
  try {
    const {
      buyerName,
      buyerEmail,
      buyerMobile,
      countryCode,
      companyName,
      softwareId,
      specifications
    } = req.body;

    if (!buyerName || !companyName || !softwareId) {
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

    const software = await Software.findById(softwareId).populate('industry');
    if (!software || !software.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Software not found or unavailable'
      });
    }

    const softwareRequest = new SoftwareRequest({
      buyerName,
      buyerEmail,
      buyerMobile,
      countryCode: countryCode || '+91',
      companyName,
      software: softwareId,
      industry: software.industry._id,
      specifications: specifications || '',
      status: 'New'
    });

    await softwareRequest.save();
    await softwareRequest.populate(['software', 'industry']);

    // Send confirmation email to buyer
    if (softwareRequest.buyerEmail) {
      try {
        await sendEmail(
          softwareRequest.buyerEmail,
          'softwareRequest',
          {
            buyerName: softwareRequest.buyerName,
            companyName: softwareRequest.companyName,
            softwareName: softwareRequest.software.name,
            softwareCode: softwareRequest.software.softwareCode,
            buyerEmail: softwareRequest.buyerEmail,
            buyerMobile: softwareRequest.buyerMobile,
            countryCode: softwareRequest.countryCode,
            specifications: softwareRequest.specifications,
            requestId: softwareRequest.requestId
          }
        );
      } catch (emailError) {
        console.error('Error sending software request email:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      requestId: softwareRequest.requestId,
      request: softwareRequest
    });
  } catch (error) {
    console.error('Error creating software request:', error);
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
    const request = await SoftwareRequest.findOne({ requestId }).populate(['software', 'industry']);
    
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
    console.error('Error verifying request:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying request',
      error: error.message
    });
  }
};

