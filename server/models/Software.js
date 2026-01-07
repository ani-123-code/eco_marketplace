const mongoose = require('mongoose');

const softwareSchema = new mongoose.Schema({
  softwareCode: {
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
  developer: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: ''
  },
  licenseType: {
    type: String,
    enum: ['free', 'paid', 'subscription', 'open-source'],
    default: 'paid'
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
    enum: ['available', 'coming-soon', 'discontinued'],
    default: 'available'
  },
  features: [{
    type: String
  }],
  systemRequirements: {
    type: Map,
    of: String
  },
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

softwareSchema.pre('save', async function(next) {
  if (!this.softwareCode && this.isNew) {
    const Industry = mongoose.model('Industry');
    const industry = await Industry.findById(this.industry);
    const industryPrefix = industry ? industry.slug.substring(0, 4).toUpperCase() : 'OP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.softwareCode = `OP-SOFT-${industryPrefix}-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

softwareSchema.index({ industry: 1, isActive: 1 });
softwareSchema.index({ softwareCode: 1 });
softwareSchema.index({ isFeatured: 1, isActive: 1 });
softwareSchema.index({ tags: 1 });

module.exports = mongoose.model('Software', softwareSchema);

