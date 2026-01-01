const mongoose = require('mongoose');

const sellerRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    trim: true
  },
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

sellerRequestSchema.pre('save', function(next) {
  if (!this.email && !this.mobile) {
    next(new Error('Either email or mobile number is required'));
  } else {
    this.updated_at = Date.now();
    next();
  }
});

module.exports = mongoose.model('SellerRequest', sellerRequestSchema);
