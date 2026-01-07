// Increase timeout for MongoDB download
jest.setTimeout(180000);

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const DataPoint = require('./DataPoint');
const Device = require('./Device');

describe('DataPoint Model', () => {
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
    await DataPoint.deleteMany({});
    await Device.deleteMany({});
  });

  describe('Create DataPoint', () => {
    it('should create a data point with valid required fields', async () => {
      const validPoint = {
        pointId: 'DP-001',
        name: '温度测点',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%ID100',
        dataType: 'INT',
      };

      const dataPoint = new DataPoint(validPoint);
      const savedPoint = await dataPoint.save();

      expect(savedPoint.pointId).toBe('DP-001');
      expect(savedPoint.name).toBe('温度测点');
      expect(savedPoint.dataType).toBe('INT');
      expect(savedPoint.rw).toBe('R'); // default value
      expect(savedPoint.category).toBe('other'); // default value
    });

    it('should create a data point with all fields', async () => {
      const device = await Device.create({
        deviceId: 'DEVICE-001',
        name: '测试设备',
        type: 'PLC',
        brand: '西门子',
      });

      const fullPoint = {
        pointId: 'DP-FULL-001',
        name: '完整数据点',
        deviceId: device._id,
        address: '%MD200',
        dataType: 'REAL',
        rw: 'RW',
        unit: '℃',
        scale: {
          factor: 0.1,
          offset: 0,
        },
        limits: {
          min: -100,
          max: 500,
          alarmHigh: 450,
          alarmLow: -50,
          warningHigh: 400,
          warningLow: 0,
        },
        description: '炉温测点',
        category: 'temperature',
        collection: {
          strategy: 'standard',
          interval: 1000,
          deadband: 0.5,
        },
        status: 'active',
        lastValue: {
          value: 150.5,
          timestamp: new Date(),
          quality: 'good',
        },
      };

      const dataPoint = new DataPoint(fullPoint);
      const savedPoint = await dataPoint.save();

      expect(savedPoint.pointId).toBe('DP-FULL-001');
      expect(savedPoint.unit).toBe('℃');
      expect(savedPoint.category).toBe('temperature');
      expect(savedPoint.limits.alarmHigh).toBe(450);
      expect(savedPoint.collection.strategy).toBe('standard');
    });

    it('should fail without required pointId', async () => {
      const invalidPoint = {
        name: '测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
      };

      const dataPoint = new DataPoint(invalidPoint);
      await expect(dataPoint.save()).rejects.toThrow();
    });

    it('should fail without required name', async () => {
      const invalidPoint = {
        pointId: 'DP-001',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
      };

      const dataPoint = new DataPoint(invalidPoint);
      await expect(dataPoint.save()).rejects.toThrow();
    });

    it('should fail without required address', async () => {
      const invalidPoint = {
        pointId: 'DP-001',
        name: '测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        dataType: 'INT',
      };

      const dataPoint = new DataPoint(invalidPoint);
      await expect(dataPoint.save()).rejects.toThrow();
    });

    it('should fail with invalid dataType', async () => {
      const invalidPoint = {
        pointId: 'DP-001',
        name: '测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INVALID_TYPE',
      };

      const dataPoint = new DataPoint(invalidPoint);
      await expect(dataPoint.save()).rejects.toThrow();
    });

    it('should fail with invalid rw value', async () => {
      const invalidPoint = {
        pointId: 'DP-001',
        name: '测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
        rw: 'INVALID',
      };

      const dataPoint = new DataPoint(invalidPoint);
      await expect(dataPoint.save()).rejects.toThrow();
    });

    it('should fail with duplicate pointId', async () => {
      const point1 = new DataPoint({
        pointId: 'UNIQUE-001',
        name: '点位1',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
      });
      await point1.save();

      const point2 = new DataPoint({
        pointId: 'UNIQUE-001',
        name: '点位2',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW65',
        dataType: 'INT',
      });

      await expect(point2.save()).rejects.toThrow();
    });
  });

  describe('DataPoint with Device Relationship', () => {
    it('should reference device correctly', async () => {
      const device = await Device.create({
        deviceId: 'REF-001',
        name: '关联测试设备',
        type: 'PLC',
        brand: '西门子',
      });

      const dataPoint = await DataPoint.create({
        pointId: 'REF-DP-001',
        name: '关联点位',
        deviceId: device._id,
        address: '%IW100',
        dataType: 'INT',
      });

      const populatedPoint = await DataPoint.findById(dataPoint._id).populate('deviceId');
      expect(populatedPoint.deviceId.deviceId).toBe('REF-001');
      expect(populatedPoint.deviceId.name).toBe('关联测试设备');
    });

    it('should find datapoints by deviceId', async () => {
      const device = await Device.create({
        deviceId: 'MULTI-001',
        name: '多点位设备',
        type: 'DCS',
        brand: '霍尼韦尔',
      });

      await DataPoint.create([
        { pointId: 'MULTI-DP-001', name: '点位1', deviceId: device._id, address: '%IW10', dataType: 'INT' },
        { pointId: 'MULTI-DP-002', name: '点位2', deviceId: device._id, address: '%IW11', dataType: 'REAL' },
        { pointId: 'MULTI-DP-003', name: '点位3', deviceId: device._id, address: '%IW12', dataType: 'BOOL' },
      ]);

      const devicePoints = await DataPoint.find({ deviceId: device._id });
      expect(devicePoints).toHaveLength(3);
    });
  });

  describe('Read DataPoint', () => {
    it('should find datapoint by pointId', async () => {
      const dataPoint = await DataPoint.create({
        pointId: 'FIND-001',
        name: '查询测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
      });

      const foundPoint = await DataPoint.findOne({ pointId: 'FIND-001' });
      expect(foundPoint).toBeTruthy();
      expect(foundPoint.name).toBe('查询测试点位');
    });

    it('should find datapoints by category', async () => {
      await DataPoint.create([
        { pointId: 'CAT-001', name: '温度点', deviceId: new mongoose.Types.ObjectId(), address: '%IW10', dataType: 'INT', category: 'temperature' },
        { pointId: 'CAT-002', name: '压力点', deviceId: new mongoose.Types.ObjectId(), address: '%IW11', dataType: 'REAL', category: 'pressure' },
        { pointId: 'CAT-003', name: '另一个温度', deviceId: new mongoose.Types.ObjectId(), address: '%IW12', dataType: 'INT', category: 'temperature' },
      ]);

      const tempPoints = await DataPoint.find({ category: 'temperature' });
      expect(tempPoints).toHaveLength(2);
    });

    it('should find datapoints by status', async () => {
      await DataPoint.create([
        { pointId: 'STAT-001', name: '激活点位', deviceId: new mongoose.Types.ObjectId(), address: '%IW10', dataType: 'INT', status: 'active' },
        { pointId: 'STAT-002', name: '故障点位', deviceId: new mongoose.Types.ObjectId(), address: '%IW11', dataType: 'INT', status: 'fault' },
        { pointId: 'STAT-003', name: '未激活', deviceId: new mongoose.Types.ObjectId(), address: '%IW12', dataType: 'INT', status: 'inactive' },
      ]);

      const activePoints = await DataPoint.find({ status: 'active' });
      expect(activePoints).toHaveLength(1);
    });
  });

  describe('Update DataPoint', () => {
    it('should update datapoint name', async () => {
      const dataPoint = await DataPoint.create({
        pointId: 'UPDATE-001',
        name: '原名称',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
      });

      const updatedPoint = await DataPoint.findByIdAndUpdate(
        dataPoint._id,
        { name: '更新后的名称' },
        { new: true }
      );

      expect(updatedPoint.name).toBe('更新后的名称');
    });

    it('should update datapoint lastValue', async () => {
      const dataPoint = await DataPoint.create({
        pointId: 'UPDATE-002',
        name: '值测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
        lastValue: {
          value: 100,
          timestamp: new Date('2023-01-01'),
          quality: 'good',
        },
      });

      const newTimestamp = new Date();
      const updatedPoint = await DataPoint.findByIdAndUpdate(
        dataPoint._id,
        {
          lastValue: {
            value: 150,
            timestamp: newTimestamp,
            quality: 'good',
          },
        },
        { new: true }
      );

      expect(updatedPoint.lastValue.value).toBe(150);
      expect(updatedPoint.lastValue.quality).toBe('good');
    });

    it('should update collection strategy', async () => {
      const dataPoint = await DataPoint.create({
        pointId: 'UPDATE-003',
        name: '策略测试点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
        collection: { strategy: 'lowfreq', interval: 5000 },
      });

      const updatedPoint = await DataPoint.findByIdAndUpdate(
        dataPoint._id,
        { 'collection.strategy': 'realtime', 'collection.interval': 100 },
        { new: true }
      );

      expect(updatedPoint.collection.strategy).toBe('realtime');
      expect(updatedPoint.collection.interval).toBe(100);
    });
  });

  describe('Delete DataPoint', () => {
    it('should delete datapoint by id', async () => {
      const dataPoint = await DataPoint.create({
        pointId: 'DELETE-001',
        name: '待删除点位',
        deviceId: new mongoose.Types.ObjectId(),
        address: '%IW64',
        dataType: 'INT',
      });

      await DataPoint.findByIdAndDelete(dataPoint._id);
      const foundPoint = await DataPoint.findOne({ pointId: 'DELETE-001' });

      expect(foundPoint).toBeNull();
    });
  });

  describe('DataPoint Indexes', () => {
    it('should have index on pointId', async () => {
      const indexes = await DataPoint.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('pointId_1');
    });

    it('should have index on deviceId', async () => {
      const indexes = await DataPoint.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('deviceId_1');
    });

    it('should have index on category', async () => {
      const indexes = await DataPoint.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('category_1');
    });
  });
});