const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  materialCode: {
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
  attributes: {
    type: Map,
    of: {
      label: String,
      value: mongoose.Schema.Types.Mixed,
      type: {
        type: String,
        enum: ['text', 'number', 'select', 'multiselect', 'range', 'boolean']
      },
      unit: String,
      filterEnabled: {
        type: Boolean,
        default: false
      }
    }
  },
  availableQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'kg'
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  certifications: [{
    type: String
  }],
  complianceFlags: [{
    type: String
  }],
  supplyRegion: {
    type: String,
    default: ''
  },
  packagingType: {
    type: String,
    default: ''
  },
  batchInfo: {
    type: String,
    default: ''
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

materialSchema.pre('save', async function(next) {
  if (!this.materialCode && this.isNew) {
    const Industry = mongoose.model('Industry');
    const industry = await Industry.findById(this.industry);
    const industryPrefix = industry ? industry.slug.substring(0, 4).toUpperCase() : 'PCR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.materialCode = `PCR-${industryPrefix}-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

materialSchema.index({ industry: 1, isActive: 1 });
materialSchema.index({ materialCode: 1 });
materialSchema.index({ isFeatured: 1, isActive: 1 });
materialSchema.index({ tags: 1 });

module.exports = mongoose.model('Material', materialSchema);
