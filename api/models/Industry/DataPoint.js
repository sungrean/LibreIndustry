const mongoose = require('mongoose');

const DataPointSchema = new mongoose.Schema({
  pointId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryDevice',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    enum: ['BOOL', 'INT', 'DINT', 'UINT', 'UDINT', 'REAL', 'LREAL', 'STRING', 'WSTRING', 'TIME', 'DATE', 'DT', 'BYTE', 'WORD', 'DWORD', 'LWORD'],
    required: true,
  },
  rw: {
    type: String,
    enum: ['R', 'W', 'RW'],
    default: 'R',
  },
  unit: {
    type: String,
  },
  scale: {
    factor: { type: Number, default: 1 },
    offset: { type: Number, default: 0 },
  },
  limits: {
    min: Number,
    max: Number,
    alarmHigh: Number,
    alarmLow: Number,
    warningHigh: Number,
    warningLow: Number,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['temperature', 'pressure', 'flow', 'level', 'speed', 'position', 'quality', 'status', 'other'],
    default: 'other',
  },
  collection: {
    strategy: {
      type: String,
      enum: ['realtime', 'highfreq', 'standard', 'lowfreq', 'onchange'],
      default: 'standard',
    },
    interval: {
      type: Number,
      default: 1000,
    },
    deadband: Number,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'fault'],
    default: 'active',
  },
  lastValue: {
    value: mongoose.Schema.Types.Mixed,
    timestamp: Date,
    quality: {
      type: String,
      enum: ['good', 'uncertain', 'bad'],
      default: 'good',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

DataPointSchema.index({ deviceId: 1 });
DataPointSchema.index({ category: 1 });
DataPointSchema.index({ status: 1 });

module.exports = mongoose.model('IndustryDataPoint', DataPointSchema);