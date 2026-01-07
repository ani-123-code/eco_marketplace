const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  machineCode: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  manufacturer: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock'
  },
  certifications: [{
    type: String
  }],
  features: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

machineSchema.pre('save', async function(next) {
  if (!this.machineCode && this.isNew) {
    const Industry = mongoose.model('Industry');
    const industry = await Industry.findById(this.industry);
    const industryPrefix = industry ? industry.slug.substring(0, 4).toUpperCase() : 'OP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.machineCode = `OP-MACH-${industryPrefix}-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

machineSchema.index({ industry: 1, isActive: 1 });
machineSchema.index({ machineCode: 1 });
machineSchema.index({ isFeatured: 1, isActive: 1 });
machineSchema.index({ tags: 1 });

module.exports = mongoose.model('Machine', machineSchema);

