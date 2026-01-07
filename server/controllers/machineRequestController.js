const MachineRequest = require('../models/MachineRequest');
const Machine = require('../models/Machine');
const { sendEmail } = require('../utils/emailService');

exports.createRequest = async (req, res) => {
  try {
    const {
      buyerName,
      buyerEmail,
      buyerMobile,
      countryCode,
      companyName,
      machineId,
      specifications
    } = req.body;

    if (!buyerName || !companyName || !machineId) {
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

    const machine = await Machine.findById(machineId).populate('industry');
    if (!machine || !machine.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found or unavailable'
      });
    }

    const machineRequest = new MachineRequest({
      buyerName,
      buyerEmail,
      buyerMobile,
      countryCode: countryCode || '+91',
      companyName,
      machine: machineId,
      industry: machine.industry._id,
      specifications: specifications || '',
      status: 'New'
    });

    await machineRequest.save();
    await machineRequest.populate(['machine', 'industry']);

    // Send confirmation email to buyer
    if (machineRequest.buyerEmail) {
      try {
        await sendEmail(
          machineRequest.buyerEmail,
          'machineRequest',
          {
            buyerName: machineRequest.buyerName,
            companyName: machineRequest.companyName,
            machineName: machineRequest.machine.name,
            machineCode: machineRequest.machine.machineCode,
            buyerEmail: machineRequest.buyerEmail,
            buyerMobile: machineRequest.buyerMobile,
            countryCode: machineRequest.countryCode,
            specifications: machineRequest.specifications,
            requestId: machineRequest.requestId
          }
        );
      } catch (emailError) {
        console.error('Error sending machine request email:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      requestId: machineRequest.requestId,
      request: machineRequest
    });
  } catch (error) {
    console.error('Error creating machine request:', error);
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
    const request = await MachineRequest.findOne({ requestId }).populate(['machine', 'industry']);
    
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

