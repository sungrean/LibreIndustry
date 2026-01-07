// Increase timeout for MongoDB download
jest.setTimeout(180000);

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Device = require('../../models/Industry/Device');
const DataPoint = require('../../models/Industry/DataPoint');
const Document = require('../../models/Industry/Document');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  const industryRouter = require('../industry');
  app.use('/api/industry', industryRouter);
  return app;
};

describe('Industry Routes', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = createTestApp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections
    await Device.deleteMany({});
    await DataPoint.deleteMany({});
    await Document.deleteMany({});
  });

  // ==================== Device Routes Tests ====================

  describe('Device Routes', () => {
    describe('GET /api/industry/devices', () => {
      it('should return empty list when no devices exist', async () => {
        const response = await request(app)
          .get('/api/industry/devices')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
        expect(response.body.pagination.total).toBe(0);
      });

      it('should return all devices', async () => {
        await Device.create([
          { deviceId: 'DEV-001', name: '设备1', type: 'PLC', brand: '西门子' },
          { deviceId: 'DEV-002', name: '设备2', type: 'DCS', brand: '霍尼韦尔' },
        ]);

        const response = await request(app)
          .get('/api/industry/devices')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('should filter devices by status', async () => {
        await Device.create([
          { deviceId: 'STAT-001', name: '在线设备', type: 'PLC', brand: '西门子', status: 'online' },
          { deviceId: 'STAT-002', name: '离线设备', type: 'DCS', brand: '霍尼韦尔', status: 'offline' },
        ]);

        const response = await request(app)
          .get('/api/industry/devices?status=online')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].deviceId).toBe('STAT-001');
      });

      it('should filter devices by type', async () => {
        await Device.create([
          { deviceId: 'TYPE-001', name: 'PLC设备', type: 'PLC', brand: '西门子' },
          { deviceId: 'TYPE-002', name: 'DCS设备', type: 'DCS', brand: '霍尼韦尔' },
          { deviceId: 'TYPE-003', name: '另一个PLC', type: 'PLC', brand: '三菱' },
        ]);

        const response = await request(app)
          .get('/api/industry/devices?type=PLC')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('should paginate results', async () => {
        await Device.create(
          Array.from({ length: 25 }, (_, i) => ({
            deviceId: `PAGE-${String(i).padStart(3, '0')}`,
            name: `分页测试设备${i + 1}`,
            type: 'PLC',
            brand: '西门子',
          }))
        );

        const response = await request(app)
          .get('/api/industry/devices?page=1&limit=10')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(10);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(10);
        expect(response.body.pagination.total).toBe(25);
        expect(response.body.pagination.pages).toBe(3);
      });
    });

    describe('GET /api/industry/devices/:id', () => {
      it('should return device by id', async () => {
        const device = await Device.create({
          deviceId: 'FIND-001',
          name: '查询测试设备',
          type: 'PLC',
          brand: '西门子',
        });

        const response = await request(app)
          .get(`/api/industry/devices/${device._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.deviceId).toBe('FIND-001');
      });

      it('should return 404 when device not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .get(`/api/industry/devices/${fakeId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('设备不存在');
      });
    });

    describe('POST /api/industry/devices', () => {
      it('should create a new device', async () => {
        const newDevice = {
          deviceId: 'NEW-001',
          name: '新建设备',
          type: 'PLC',
          brand: '西门子',
          model: 'S7-1200',
        };

        const response = await request(app)
          .post('/api/industry/devices')
          .send(newDevice)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.deviceId).toBe('NEW-001');
        expect(response.body.data.name).toBe('新建设备');
      });

      it('should return 400 for invalid device data', async () => {
        const invalidDevice = {
          deviceId: 'INVALID-001',
          name: '无效设备',
          // missing required type and brand
        };

        const response = await request(app)
          .post('/api/industry/devices')
          .send(invalidDevice)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/industry/devices/:id', () => {
      it('should update device', async () => {
        const device = await Device.create({
          deviceId: 'UPDATE-001',
          name: '原名称',
          type: 'PLC',
          brand: '西门子',
        });

        const response = await request(app)
          .put(`/api/industry/devices/${device._id}`)
          .send({ name: '更新后的名称', status: 'online' })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('更新后的名称');
        expect(response.body.data.status).toBe('online');
      });

      it('should return 404 when updating non-existent device', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .put(`/api/industry/devices/${fakeId}`)
          .send({ name: '更新名称' })
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('设备不存在');
      });
    });

    describe('DELETE /api/industry/devices/:id', () => {
      it('should delete device', async () => {
        const device = await Device.create({
          deviceId: 'DELETE-001',
          name: '待删除设备',
          type: 'PLC',
          brand: '西门子',
        });

        const response = await request(app)
          .delete(`/api/industry/devices/${device._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('设备已删除');

        const deletedDevice = await Device.findOne({ deviceId: 'DELETE-001' });
        expect(deletedDevice).toBeNull();
      });

      it('should return 404 when deleting non-existent device', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`/api/industry/devices/${fakeId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });

    describe('PATCH /api/industry/devices/:id/status', () => {
      it('should update device status', async () => {
        const device = await Device.create({
          deviceId: 'STATUS-001',
          name: '状态测试设备',
          type: 'PLC',
          brand: '西门子',
          status: 'offline',
        });

        const response = await request(app)
          .patch(`/api/industry/devices/${device._id}/status`)
          .send({ status: 'online' })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('online');
        expect(response.body.data.lastSeen).toBeDefined();
      });
    });
  });

  // ==================== DataPoint Routes Tests ====================

  describe('DataPoint Routes', () => {
    let testDevice;

    beforeEach(async () => {
      testDevice = await Device.create({
        deviceId: 'DP-TEST-001',
        name: '数据点测试设备',
        type: 'PLC',
        brand: '西门子',
      });
    });

    describe('GET /api/industry/datapoints', () => {
      it('should return empty list when no datapoints exist', async () => {
        const response = await request(app)
          .get('/api/industry/datapoints')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });

      it('should return all datapoints', async () => {
        await DataPoint.create([
          { pointId: 'DP-001', name: '温度点', deviceId: testDevice._id, address: '%IW10', dataType: 'INT' },
          { pointId: 'DP-002', name: '压力点', deviceId: testDevice._id, address: '%IW11', dataType: 'REAL' },
        ]);

        const response = await request(app)
          .get('/api/industry/datapoints')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('should filter datapoints by deviceId', async () => {
        const device2 = await Device.create({
          deviceId: 'DP-TEST-002',
          name: '第二测试设备',
          type: 'DCS',
          brand: '霍尼韦尔',
        });

        await DataPoint.create([
          { pointId: 'DP-001', name: '设备1的点', deviceId: testDevice._id, address: '%IW10', dataType: 'INT' },
          { pointId: 'DP-002', name: '设备2的点', deviceId: device2._id, address: '%IW11', dataType: 'REAL' },
        ]);

        const response = await request(app)
          .get(`/api/industry/datapoints?deviceId=${testDevice._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].pointId).toBe('DP-001');
      });
    });

    describe('GET /api/industry/devices/:deviceId/datapoints', () => {
      it('should return datapoints for device', async () => {
        await DataPoint.create([
          { pointId: 'DEV-DP-001', name: '设备关联点1', deviceId: testDevice._id, address: '%IW10', dataType: 'INT' },
          { pointId: 'DEV-DP-002', name: '设备关联点2', deviceId: testDevice._id, address: '%IW11', dataType: 'REAL' },
        ]);

        const response = await request(app)
          .get(`/api/industry/devices/${testDevice._id}/datapoints`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });
    });

    describe('GET /api/industry/datapoints/realtime', () => {
      it('should return realtime data for specified datapoints', async () => {
        const dp1 = await DataPoint.create({
          pointId: 'RT-001', name: '实时点1', deviceId: testDevice._id, address: '%IW10', dataType: 'INT',
          lastValue: { value: 100, timestamp: new Date(), quality: 'good' },
        });
        const dp2 = await DataPoint.create({
          pointId: 'RT-002', name: '实时点2', deviceId: testDevice._id, address: '%IW11', dataType: 'INT',
          lastValue: { value: 200, timestamp: new Date(), quality: 'good' },
        });

        const response = await request(app)
          .get(`/api/industry/datapoints/realtime?ids=${dp1._id},${dp2._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });
    });
  });

  // ==================== Document Routes Tests ====================

  describe('Document Routes', () => {
    describe('GET /api/industry/documents', () => {
      it('should return empty list when no documents exist', async () => {
        const response = await request(app)
          .get('/api/industry/documents')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });

      it('should return all documents', async () => {
        const userId = new mongoose.Types.ObjectId();
        await Document.create([
          { name: '文档1.pdf', originalName: 'doc1.pdf', type: 'pdf', size: 1024000, path: '/uploads/1.pdf', uploadedBy: userId },
          { name: '文档2.xlsx', originalName: 'doc2.xlsx', type: 'xlsx', size: 2048000, path: '/uploads/2.xlsx', uploadedBy: userId },
        ]);

        const response = await request(app)
          .get('/api/industry/documents')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('should filter documents by category', async () => {
        const userId = new mongoose.Types.ObjectId();
        await Document.create([
          { name: '设备手册.pdf', originalName: 'device.pdf', type: 'pdf', size: 1024000, path: '/uploads/1.pdf', category: '设备文档', uploadedBy: userId },
          { name: '操作手册.pdf', originalName: 'operation.pdf', type: 'pdf', size: 2048000, path: '/uploads/2.pdf', category: '操作手册', uploadedBy: userId },
        ]);

        const response = await request(app)
          .get('/api/industry/documents?category=设备文档')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].name).toBe('设备手册.pdf');
      });

      it('should paginate results', async () => {
        const userId = new mongoose.Types.ObjectId();
        await Document.create(
          Array.from({ length: 25 }, (_, i) => ({
            name: `分页测试文档${i + 1}.pdf`,
            originalName: `doc${i + 1}.pdf`,
            type: 'pdf',
            size: 1024000,
            path: `/uploads/doc${i + 1}.pdf`,
            uploadedBy: userId,
          }))
        );

        const response = await request(app)
          .get('/api/industry/documents?page=2&limit=10')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(10);
        expect(response.body.pagination.page).toBe(2);
        expect(response.body.pagination.total).toBe(25);
        expect(response.body.pagination.pages).toBe(3);
      });
    });

    describe('GET /api/industry/documents/:id', () => {
      it('should return document by id', async () => {
        const userId = new mongoose.Types.ObjectId();
        const document = await Document.create({
          name: '查询测试文档.pdf',
          originalName: 'find-test.pdf',
          type: 'pdf',
          size: 1024000,
          path: '/uploads/find-test.pdf',
          uploadedBy: userId,
        });

        const response = await request(app)
          .get(`/api/industry/documents/${document._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('查询测试文档.pdf');
      });

      it('should return 404 when document not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .get(`/api/industry/documents/${fakeId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('文档不存在');
      });

      it('should update lastAccessedAt when accessing document', async () => {
        const userId = new mongoose.Types.ObjectId();
        const originalTime = new Date('2023-01-01');
        const document = await Document.create({
          name: '访问测试文档.pdf',
          originalName: 'access-test.pdf',
          type: 'pdf',
          size: 1024000,
          path: '/uploads/access-test.pdf',
          lastAccessedAt: originalTime,
          uploadedBy: userId,
        });

        const response = await request(app)
          .get(`/api/industry/documents/${document._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(new Date(response.body.data.lastAccessedAt).getTime()).toBeGreaterThan(originalTime.getTime());
      });
    });

    describe('POST /api/industry/documents', () => {
      it('should create a new document', async () => {
        const userId = new mongoose.Types.ObjectId();
        const newDocument = {
          name: '新文档.pdf',
          originalName: 'new-doc.pdf',
          type: 'pdf',
          size: 1024000,
          path: '/uploads/new-doc.pdf',
          category: '设备文档',
          uploadedBy: userId.toString(),
        };

        const response = await request(app)
          .post('/api/industry/documents')
          .send(newDocument)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('新文档.pdf');
      });

      it('should return 400 for invalid document data', async () => {
        const invalidDocument = {
          name: '无效文档',
          // missing required fields
        };

        const response = await request(app)
          .post('/api/industry/documents')
          .send(invalidDocument)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/industry/documents/:id', () => {
      it('should delete document', async () => {
        const userId = new mongoose.Types.ObjectId();
        const document = await Document.create({
          name: '待删除文档.pdf',
          originalName: 'delete-me.pdf',
          type: 'pdf',
          size: 1024000,
          path: '/uploads/delete-me.pdf',
          uploadedBy: userId,
        });

        const response = await request(app)
          .delete(`/api/industry/documents/${document._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('文档已删除');

        const deletedDoc = await Document.findOne({ name: '待删除文档.pdf' });
        expect(deletedDoc).toBeNull();
      });

      it('should return 404 when deleting non-existent document', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`/api/industry/documents/${fakeId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });
  });

  // ==================== Integration Tests ====================

  describe('Integration Scenarios', () => {
    it('should create device and associated datapoints', async () => {
      // 1. Create device
      const deviceResponse = await request(app)
        .post('/api/industry/devices')
        .send({
          deviceId: 'INT-001',
          name: '集成测试设备',
          type: 'PLC',
          brand: '西门子',
        })
        .expect(201);

      const deviceId = deviceResponse.body.data._id;

      // 2. Create datapoints for device
      const dp1Response = await request(app)
        .post('/api/industry/datapoints')
        .send({
          pointId: 'INT-DP-001',
          name: '集成测试点1',
          deviceId: deviceId,
          address: '%IW100',
          dataType: 'INT',
        })
        .expect(201);

      const dp2Response = await request(app)
        .post('/api/industry/datapoints')
        .send({
          pointId: 'INT-DP-002',
          name: '集成测试点2',
          deviceId: deviceId,
          address: '%IW101',
          dataType: 'REAL',
        })
        .expect(201);

      // 3. Verify datapoints are associated with device
      const datapointsResponse = await request(app)
        .get(`/api/industry/devices/${deviceId}/datapoints`)
        .expect(200);

      expect(datapointsResponse.body.data).toHaveLength(2);
    });

    it('should handle full document workflow', async () => {
      const userId = new mongoose.Types.ObjectId();

      // 1. Upload document
      const uploadResponse = await request(app)
        .post('/api/industry/documents')
        .send({
          name: '工作流测试文档.pdf',
          originalName: 'workflow-test.pdf',
          type: 'pdf',
          size: 1024000,
          path: '/uploads/workflow-test.pdf',
          category: '质量报告',
          uploadedBy: userId.toString(),
        })
        .expect(201);

      const documentId = uploadResponse.body.data._id;

      // 2. Query document
      const queryResponse = await request(app)
        .get(`/api/industry/documents/${documentId}`)
        .expect(200);

      expect(queryResponse.body.data.name).toBe('工作流测试文档.pdf');

      // 3. Delete document
      const deleteResponse = await request(app)
        .delete(`/api/industry/documents/${documentId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);

      // 4. Verify deletion
      const verifyResponse = await request(app)
        .get(`/api/industry/documents/${documentId}`)
        .expect(404);
    });
  });
});