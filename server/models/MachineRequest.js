const mongoose = require('mongoose');

const machineRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    uppercase: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  buyerMobile: {
    type: String,
    trim: true
  },
  countryCode: {
    type: String,
    default: '+91'
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry'
  },
  specifications: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'Reviewed', 'Confirmed', 'Dispatched', 'Completed', 'Cancelled'],
    default: 'New'
  },
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  confirmedAt: Date,
  dispatchedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

machineRequestSchema.pre('save', function(next) {
  if (!this.requestId && this.isNew) {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.requestId = `MACH-REQ-${year}-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

machineRequestSchema.index({ requestId: 1 });
machineRequestSchema.index({ status: 1, createdAt: -1 });
machineRequestSchema.index({ machine: 1 });
machineRequestSchema.index({ industry: 1 });

module.exports = mongoose.model('MachineRequest', machineRequestSchema);

