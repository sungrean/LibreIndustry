const express = require('express');
const router = express.Router();
const Device = require('../models/Industry/Device');
const DataPoint = require('../models/Industry/DataPoint');
const Document = require('../models/Industry/Document');
const ThirdPartySystem = require('../models/Industry/ThirdPartySystem');

// ==================== 设备管理 API ====================

// 获取所有设备
router.get('/devices', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const devices = await Device.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Device.countDocuments(filter);
    
    res.json({
      success: true,
      data: devices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个设备
router.get('/devices/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: '设备不存在' });
    }
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建设备
router.post('/devices', async (req, res) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json({ success: true, data: device });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 更新设备
router.put('/devices/:id', async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!device) {
      return res.status(404).json({ success: false, error: '设备不存在' });
    }
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 删除设备
router.delete('/devices/:id', async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: '设备不存在' });
    }
    res.json({ success: true, message: '设备已删除' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新设备状态
router.patch('/devices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { status, lastSeen: new Date() },
      { new: true }
    );
    if (!device) {
      return res.status(404).json({ success: false, error: '设备不存在' });
    }
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== 数据点位 API ====================

// 获取设备关联的数据点位
router.get('/devices/:deviceId/datapoints', async (req, res) => {
  try {
    const points = await DataPoint.find({ deviceId: req.params.deviceId });
    res.json({ success: true, data: points });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取所有数据点位
router.get('/datapoints', async (req, res) => {
  try {
    const { deviceId, category, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (deviceId) filter.deviceId = deviceId;
    if (category) filter.category = category;
    
    const points = await DataPoint.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: points });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取实时数据
router.get('/datapoints/realtime', async (req, res) => {
  try {
    const { ids } = req.query;
    const pointIds = ids ? ids.split(',') : [];
    const points = await DataPoint.find({ _id: { $in: pointIds } });
    res.json({ 
      success: true, 
      data: points.map(p => ({
        id: p._id,
        pointId: p.pointId,
        name: p.name,
        value: p.lastValue?.value,
        timestamp: p.lastValue?.timestamp,
        quality: p.lastValue?.quality,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建数据点位
router.post('/datapoints', async (req, res) => {
  try {
    const datapoint = new DataPoint(req.body);
    await datapoint.save();
    res.status(201).json({ success: true, data: datapoint });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== 文档管理 API ====================

// 获取所有文档
router.get('/documents', async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search };
    }
    
    const documents = await Document.find(filter)
      .populate('uploadedBy', 'username name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Document.countDocuments(filter);
    
    res.json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个文档
router.get('/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'username name')
      .populate('analysis.relatedDevices');
    
    if (!document) {
      return res.status(404).json({ success: false, error: '文档不存在' });
    }
    
    // 更新访问时间
    document.lastAccessedAt = new Date();
    await document.save();
    
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 上传文档（简化版，实际应配合 multer）
router.post('/documents', async (req, res) => {
  try {
    const document = new Document({
      ...req.body,
      uploadedBy: req.user?._id || 'system',
    });
    await document.save();
    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 删除文档
router.delete('/documents/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, error: '文档不存在' });
    }
    res.json({ success: true, message: '文档已删除' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 文档分析
router.post('/documents/:id/analyze', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, error: '文档不存在' });
    }
    
    // TODO: 实现文档分析逻辑
    document.status = 'processing';
    await document.save();
    
    // 模拟分析完成
    document.status = 'completed';
    document.analysis = {
      extractedText: '文档内容提取中...',
      summary: '文档分析完成',
    };
    await document.save();
    
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== 第三方系统 API ====================

// 获取所有第三方系统
router.get('/systems', async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const systems = await ThirdPartySystem.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await ThirdPartySystem.countDocuments(filter);
    
    res.json({
      success: true,
      data: systems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个系统
router.get('/systems/:id', async (req, res) => {
  try {
    const system = await ThirdPartySystem.findById(req.params.id);
    if (!system) {
      return res.status(404).json({ success: false, error: '系统不存在' });
    }
    res.json({ success: true, data: system });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建第三方系统
router.post('/systems', async (req, res) => {
  try {
    const system = new ThirdPartySystem({
      ...req.body,
      owner: req.user?._id || 'system',
    });
    await system.save();
    res.status(201).json({ success: true, data: system });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 更新第三方系统
router.put('/systems/:id', async (req, res) => {
  try {
    const system = await ThirdPartySystem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!system) {
      return res.status(404).json({ success: false, error: '系统不存在' });
    }
    res.json({ success: true, data: system });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 删除第三方系统
router.delete('/systems/:id', async (req, res) => {
  try {
    const system = await ThirdPartySystem.findByIdAndDelete(req.params.id);
    if (!system) {
      return res.status(404).json({ success: false, error: '系统不存在' });
    }
    res.json({ success: true, message: '系统已删除' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 测试系统连接
router.post('/systems/:id/test', async (req, res) => {
  try {
    const system = await ThirdPartySystem.findById(req.params.id);
    if (!system) {
      return res.status(404).json({ success: false, error: '系统不存在' });
    }
    
    // TODO: 实现实际的连接测试逻辑
    const testResult = {
      success: true,
      latency: Math.floor(Math.random() * 100) + 10,
      message: '连接测试成功',
    };
    
    res.json({ success: true, data: testResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== 仪表盘统计 API ====================

router.get('/dashboard/stats', async (req, res) => {
  try {
    const [deviceCount, onlineDevices, documentCount, systemCount] = await Promise.all([
      Device.countDocuments(),
      Device.countDocuments({ status: 'online' }),
      Document.countDocuments({ status: 'completed' }),
      ThirdPartySystem.countDocuments({ status: 'connected' }),
    ]);
    
    const dataPointCount = await DataPoint.countDocuments();
    
    res.json({
      success: true,
      data: {
        devices: {
          total: deviceCount,
          online: onlineDevices,
        },
        documents: documentCount,
        dataPoints: dataPointCount,
        systems: systemCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;