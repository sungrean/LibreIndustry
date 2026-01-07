const mongoose = require('mongoose');

const ThirdPartySystemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['ERP', 'MES', 'WMS', 'SCADA', 'CRM', 'PLM', 'QMS', 'CMMS', '其他'],
    required: true,
  },
  vendor: {
    type: String,
  },
  version: {
    type: String,
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error', 'pending'],
    default: 'pending',
  },
  protocol: {
    type: String,
    enum: ['REST', 'SOAP', 'OPCUA', 'MQTT', 'WebSocket', 'GRPC', 'Database', 'File', '其他'],
    required: true,
  },
  endpoint: {
    url: String,
    host: String,
    port: Number,
    path: String,
  },
  auth: {
    type: {
      type: String,
      enum: ['none', 'basic', 'bearer', 'oauth2', 'apiKey', 'certificate'],
    },
    credentials: {
      username: String,
      password: String,
      token: String,
      apiKey: String,
      certificate: String,
    },
  },
  mapping: {
    inbound: [{
      localField: String,
      remoteField: String,
      transform: String,
    }],
    outbound: [{
      localField: String,
      remoteField: String,
      transform: String,
    }],
  },
  sync: {
    enabled: {
      type: Boolean,
      default: false,
    },
    interval: {
      type: Number,
      default: 60000,
    },
    lastSync: Date,
    direction: {
      type: String,
      enum: ['inbound', 'outbound', 'bidirectional'],
      default: 'bidirectional',
    },
  },
  errorLog: [{
    timestamp: Date,
    message: String,
    code: Number,
    resolved: Boolean,
  }],
  metadata: {
    contactPerson: String,
    contactEmail: String,
    documentation: String,
    tags: [String],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

ThirdPartySystemSchema.index({ type: 1 });
ThirdPartySystemSchema.index({ status: 1 });

module.exports = mongoose.model('IndustryThirdPartySystem', ThirdPartySystemSchema);