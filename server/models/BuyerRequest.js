const mongoose = require('mongoose');

const buyerRequestSchema = new mongoose.Schema({
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
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry'
  },
  requestedQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  requestedUnit: {
    type: String,
    default: 'kg'
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
  quantityFulfilled: {
    type: Number,
    default: 0
  },
  stockDeducted: {
    type: Boolean,
    default: false
  },
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

buyerRequestSchema.pre('save', function(next) {
  if (!this.requestId && this.isNew) {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.requestId = `REQ-${year}-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

buyerRequestSchema.index({ requestId: 1 });
buyerRequestSchema.index({ status: 1, createdAt: -1 });
buyerRequestSchema.index({ material: 1 });
buyerRequestSchema.index({ industry: 1 });
buyerRequestSchema.index({ buyerEmail: 1 });
buyerRequestSchema.index({ companyName: 1 });

module.exports = mongoose.model('BuyerRequest', buyerRequestSchema);
