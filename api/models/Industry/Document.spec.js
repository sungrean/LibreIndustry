// Increase timeout for MongoDB download
jest.setTimeout(180000);

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Document = require('./Document');

describe('Document Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database before each test
    await Document.deleteMany({});
  });

  describe('Create Document', () => {
    it('should create a document with valid required fields', async () => {
      const validDocument = {
        name: '设备操作手册.pdf',
        originalName: 'S7-1200操作手册.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/docs/device-manual.pdf',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(validDocument);
      const savedDocument = await document.save();

      expect(savedDocument.name).toBe('设备操作手册.pdf');
      expect(savedDocument.originalName).toBe('S7-1200操作手册.pdf');
      expect(savedDocument.type).toBe('pdf');
      expect(savedDocument.size).toBe(1024000);
      expect(savedDocument.category).toBe('其他'); // default value
      expect(savedDocument.status).toBe('uploading'); // default value
      expect(savedDocument.downloadCount).toBe(0); // default value
    });

    it('should create a document with all fields', async () => {
      const userId = new mongoose.Types.ObjectId();
      const deviceId = new mongoose.Types.ObjectId();

      const fullDocument = {
        name: '质量检测报告.xlsx',
        originalName: '2024年质量检测报告.xlsx',
        type: 'xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 5242880,
        path: '/uploads/docs/quality-report.xlsx',
        category: '质量报告',
        tags: ['质量', '2024', '检测'],
        description: '2024年度产品质量检测报告',
        metadata: {
          author: '质量部',
          version: '1.2',
          pages: 45,
          fileHash: 'abc123def456',
        },
        analysis: {
          extractedText: '本报告描述了产品检测结果...',
          entities: [
            { type: 'device', value: 'PLC-001', position: { page: 1, line: 5 } },
            { type: 'parameter', value: '温度', position: { page: 2, line: 10 } },
          ],
          summary: '产品质量合格，符合标准要求',
          relatedDevices: [deviceId],
        },
        uploadedBy: userId,
        status: 'completed',
      };

      const document = new Document(fullDocument);
      const savedDocument = await document.save();

      expect(savedDocument.name).toBe('质量检测报告.xlsx');
      expect(savedDocument.category).toBe('质量报告');
      expect(savedDocument.tags).toHaveLength(3);
      expect(savedDocument.metadata.version).toBe('1.2');
      expect(savedDocument.analysis.summary).toBe('产品质量合格，符合标准要求');
    });

    it('should fail without required name', async () => {
      const invalidDocument = {
        originalName: 'test.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/test.pdf',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail without required originalName', async () => {
      const invalidDocument = {
        name: '测试文档',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/test.pdf',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail without required type', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.doc',
        size: 1024000,
        path: '/uploads/test.doc',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail without required size', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.pdf',
        type: 'pdf',
        path: '/uploads/test.pdf',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail without required path', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.pdf',
        type: 'pdf',
        size: 1024000,
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail without required uploadedBy', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/test.pdf',
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail with invalid document type', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.xyz',
        type: 'invalid_type',
        size: 1024000,
        path: '/uploads/test.xyz',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail with invalid category', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/test.pdf',
        category: '无效分类',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });

    it('should fail with invalid status', async () => {
      const invalidDocument = {
        name: '测试文档',
        originalName: 'test.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/test.pdf',
        status: 'invalid_status',
        uploadedBy: new mongoose.Types.ObjectId(),
      };

      const document = new Document(invalidDocument);
      await expect(document.save()).rejects.toThrow();
    });
  });

  describe('Read Document', () => {
    it('should find document by name with text search', async () => {
      await Document.create([
        { name: 'PLC编程手册.pdf', originalName: 'plc-manual.pdf', type: 'pdf', size: 1024000, path: '/uploads/1.pdf', uploadedBy: new mongoose.Types.ObjectId() },
        { name: 'S7-1200用户手册.pdf', originalName: 's7-1200-manual.pdf', type: 'pdf', size: 2048000, path: '/uploads/2.pdf', uploadedBy: new mongoose.Types.ObjectId() },
        { name: '温度传感器说明.doc', originalName: 'temp-sensor.doc', type: 'doc', size: 512000, path: '/uploads/3.doc', uploadedBy: new mongoose.Types.ObjectId() },
      ]);

      const docs = await Document.find({ $text: { $search: 'PLC' } });
      expect(docs.length).toBeGreaterThanOrEqual(1);
    });

    it('should find documents by category', async () => {
      await Document.create([
        { name: '设备手册.pdf', originalName: 'device.pdf', type: 'pdf', size: 1024000, path: '/uploads/1.pdf', category: '设备文档', uploadedBy: new mongoose.Types.ObjectId() },
        { name: '操作手册.pdf', originalName: 'operation.pdf', type: 'pdf', size: 2048000, path: '/uploads/2.pdf', category: '操作手册', uploadedBy: new mongoose.Types.ObjectId() },
        { name: '另一个设备手册.pdf', originalName: 'device2.pdf', type: 'pdf', size: 512000, path: '/uploads/3.pdf', category: '设备文档', uploadedBy: new mongoose.Types.ObjectId() },
      ]);

      const deviceDocs = await Document.find({ category: '设备文档' });
      expect(deviceDocs).toHaveLength(2);
    });

    it('should find documents by status', async () => {
      await Document.create([
        { name: '待处理文档.pdf', originalName: 'pending.pdf', type: 'pdf', size: 1024000, path: '/uploads/1.pdf', status: 'processing', uploadedBy: new mongoose.Types.ObjectId() },
        { name: '已完成文档.pdf', originalName: 'completed.pdf', type: 'pdf', size: 2048000, path: '/uploads/2.pdf', status: 'completed', uploadedBy: new mongoose.Types.ObjectId() },
        { name: '另一个已完成.pdf', originalName: 'completed2.pdf', type: 'pdf', size: 512000, path: '/uploads/3.pdf', status: 'completed', uploadedBy: new mongoose.Types.ObjectId() },
      ]);

      const completedDocs = await Document.find({ status: 'completed' });
      expect(completedDocs).toHaveLength(2);
    });

    it('should paginate results', async () => {
      await Document.create(
        Array.from({ length: 25 }, (_, i) => ({
          name: `分页测试文档${i + 1}.pdf`,
          originalName: `doc${i + 1}.pdf`,
          type: 'pdf',
          size: 1024000,
          path: `/uploads/doc${i + 1}.pdf`,
          uploadedBy: new mongoose.Types.ObjectId(),
        }))
      );

      const page1 = await Document.find()
        .skip(0)
        .limit(10)
        .sort({ createdAt: -1 });
      const page2 = await Document.find()
        .skip(10)
        .limit(10)
        .sort({ createdAt: -1 });
      const page3 = await Document.find()
        .skip(20)
        .limit(10)
        .sort({ createdAt: -1 });

      expect(page1).toHaveLength(10);
      expect(page2).toHaveLength(10);
      expect(page3).toHaveLength(5);
    });
  });

  describe('Update Document', () => {
    it('should update document name', async () => {
      const document = await Document.create({
        name: '原名称.pdf',
        originalName: 'original.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/original.pdf',
        uploadedBy: new mongoose.Types.ObjectId(),
      });

      const updatedDocument = await Document.findByIdAndUpdate(
        document._id,
        { name: '更新后的名称.pdf' },
        { new: true }
      );

      expect(updatedDocument.name).toBe('更新后的名称.pdf');
    });

    it('should update document status', async () => {
      const document = await Document.create({
        name: '处理中文档.pdf',
        originalName: 'processing.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/processing.pdf',
        status: 'processing',
        uploadedBy: new mongoose.Types.ObjectId(),
      });

      const updatedDocument = await Document.findByIdAndUpdate(
        document._id,
        { status: 'completed' },
        { new: true }
      );

      expect(updatedDocument.status).toBe('completed');
    });

    it('should update lastAccessedAt when accessing document', async () => {
      const originalTime = new Date('2023-01-01');
      const document = await Document.create({
        name: '访问测试文档.pdf',
        originalName: 'access-test.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/access-test.pdf',
        lastAccessedAt: originalTime,
        uploadedBy: new mongoose.Types.ObjectId(),
      });

      const updatedDocument = await Document.findByIdAndUpdate(
        document._id,
        { lastAccessedAt: new Date() },
        { new: true }
      );

      expect(updatedDocument.lastAccessedAt.getTime()).toBeGreaterThan(originalTime.getTime());
    });

    it('should increment download count', async () => {
      const document = await Document.create({
        name: '下载测试文档.pdf',
        originalName: 'download-test.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/download-test.pdf',
        downloadCount: 5,
        uploadedBy: new mongoose.Types.ObjectId(),
      });

      const updatedDocument = await Document.findByIdAndUpdate(
        document._id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      );

      expect(updatedDocument.downloadCount).toBe(6);
    });
  });

  describe('Delete Document', () => {
    it('should delete document by id', async () => {
      const document = await Document.create({
        name: '待删除文档.pdf',
        originalName: 'delete-me.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/delete-me.pdf',
        uploadedBy: new mongoose.Types.ObjectId(),
      });

      await Document.findByIdAndDelete(document._id);
      const foundDocument = await Document.findOne({ name: '待删除文档.pdf' });

      expect(foundDocument).toBeNull();
    });
  });

  describe('Document Population', () => {
    it('should populate uploadedBy user info', async () => {
      const userId = new mongoose.Types.ObjectId();
      const document = await Document.create({
        name: '用户文档.pdf',
        originalName: 'user-doc.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/user-doc.pdf',
        uploadedBy: userId,
      });

      const populatedDoc = await Document.findById(document._id).populate('uploadedBy', 'username name');
      expect(populatedDoc.uploadedBy._id.toString()).toBe(userId.toString());
    });

    it('should populate related devices from analysis', async () => {
      const deviceId1 = new mongoose.Types.ObjectId();
      const deviceId2 = new mongoose.Types.ObjectId();
      const document = await Document.create({
        name: '关联设备文档.pdf',
        originalName: 'related-devices.pdf',
        type: 'pdf',
        size: 1024000,
        path: '/uploads/related.pdf',
        analysis: {
          relatedDevices: [deviceId1, deviceId2],
        },
        uploadedBy: new mongoose.Types.ObjectId(),
      });

      const populatedDoc = await Document.findById(document._id).populate('analysis.relatedDevices');
      expect(populatedDoc.analysis.relatedDevices).toHaveLength(2);
    });
  });

  describe('Document Indexes', () => {
    it('should have text index on name, description, and analysis.extractedText', async () => {
      const indexes = await Document.collection.indexes();
      const textIndex = indexes.find((idx) => idx.key && idx.key.name === 'text');
      expect(textIndex).toBeDefined();
    });

    it('should have index on category', async () => {
      const indexes = await Document.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('category_1');
    });

    it('should have index on uploadedBy', async () => {
      const indexes = await Document.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('uploadedBy_1');
    });

    it('should have index on status', async () => {
      const indexes = await Document.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('status_1');
    });
  });
});