const SellerRequest = require('../models/SellerRequest');
const { sendEmail } = require('../utils/emailService');

exports.createSellerRequest = async (req, res) => {
  try {
    const { name, email, mobile, company_name } = req.body;

    if (!name || !company_name) {
      return res.status(400).json({
        success: false,
        message: 'Name and company name are required'
      });
    }

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Either email or mobile number is required'
      });
    }

    const sellerRequest = new SellerRequest({
      name,
      email,
      mobile,
      company_name
    });

    await sellerRequest.save();

    // Send confirmation email to seller
    const emailTo = sellerRequest.email || null;
    if (emailTo) {
      try {
        await sendEmail(
          emailTo,
          'sellerRequest',
          {
            name: sellerRequest.name,
            company_name: sellerRequest.company_name,
            email: sellerRequest.email,
            mobile: sellerRequest.mobile
          }
        );
      } catch (emailError) {
        console.error('Error sending seller request email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Seller request submitted successfully',
      data: {
        id: sellerRequest._id,
        name: sellerRequest.name,
        company_name: sellerRequest.company_name
      }
    });
  } catch (error) {
    console.error('Error creating seller request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit seller request',
      error: error.message
    });
  }
};

exports.getAllSellerRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const sellerRequests = await SellerRequest.find(filter)
      .sort({ created_at: -1 });

    res.json({
      success: true,
      count: sellerRequests.length,
      data: sellerRequests
    });
  } catch (error) {
    console.error('Error fetching seller requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller requests',
      error: error.message
    });
  }
};

exports.updateSellerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = { updated_at: Date.now() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const sellerRequest = await SellerRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sellerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Seller request not found'
      });
    }

    res.json({
      success: true,
      message: 'Seller request updated successfully',
      data: sellerRequest
    });
  } catch (error) {
    console.error('Error updating seller request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update seller request',
      error: error.message
    });
  }
};

exports.deleteSellerRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const sellerRequest = await SellerRequest.findByIdAndDelete(id);

    if (!sellerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Seller request not found'
      });
    }

    res.json({
      success: true,
      message: 'Seller request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting seller request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete seller request',
      error: error.message
    });
  }
};
