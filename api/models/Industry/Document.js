const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'image', 'other'],
    required: true,
  },
  mimeType: String,
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['设备文档', '工艺文件', '质量报告', '操作手册', '维护指南', '数据报告', '其他'],
    default: '其他',
  },
  tags: [String],
  description: String,
  metadata: {
    author: String,
    version: String,
    pages: Number,
    fileHash: String,
  },
  analysis: {
    extractedText: String,
    entities: [{
      type: String,
      value: String,
      position: {
        page: Number,
        line: Number,
      },
    }],
    summary: String,
    relatedDevices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustryDevice',
    }],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading',
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  lastAccessedAt: Date,
}, {
  timestamps: true,
});

DocumentSchema.index({ name: 'text', description: 'text', 'analysis.extractedText': 'text' });
DocumentSchema.index({ category: 1 });
DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ status: 1 });

module.exports = mongoose.model('IndustryDocument', DocumentSchema);