const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Device = require('./Device');

// Increase timeout for MongoDB download
jest.setTimeout(180000);

describe('Device Model', () => {
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
    await Device.deleteMany({});
  });

  describe('Create Device', () => {
    it('should create a device with valid required fields', async () => {
      const validDevice = {
        deviceId: 'PLC-001',
        name: '西门子PLC主机',
        type: 'PLC',
        brand: '西门子',
      };

      const device = new Device(validDevice);
      const savedDevice = await device.save();

      expect(savedDevice.deviceId).toBe('PLC-001');
      expect(savedDevice.name).toBe('西门子PLC主机');
      expect(savedDevice.type).toBe('PLC');
      expect(savedDevice.brand).toBe('西门子');
      expect(savedDevice.status).toBe('offline'); // default value
    });

    it('should create a device with all fields', async () => {
      const fullDevice = {
        deviceId: 'DCS-001',
        name: 'DCS控制系统',
        type: 'DCS',
        brand: '霍尼韦尔',
        model: 'Experion PKS',
        status: 'online',
        connection: {
          protocol: 'S7',
          host: '192.168.1.100',
          port: 502,
          rack: 0,
          slot: 1,
          timeout: 5000,
        },
        location: {
          factory: '一号工厂',
          workshop: 'A车间',
          line: '生产线1',
          position: '控制室',
        },
        tags: [
          {
            tagId: 'TAG001',
            name: '温度传感器',
            address: '%IW64',
            dataType: 'INT',
            rw: 'R',
            description: '入口温度',
          },
        ],
        metadata: {
          serialNumber: 'SN123456',
          manufactureDate: new Date('2023-01-15'),
          installDate: new Date('2023-03-20'),
        },
      };

      const device = new Device(fullDevice);
      const savedDevice = await device.save();

      expect(savedDevice.deviceId).toBe('DCS-001');
      expect(savedDevice.connection.protocol).toBe('S7');
      expect(savedDevice.location.factory).toBe('一号工厂');
      expect(savedDevice.tags).toHaveLength(1);
    });

    it('should fail without required deviceId', async () => {
      const invalidDevice = {
        name: '测试设备',
        type: 'PLC',
        brand: '三菱',
      };

      const device = new Device(invalidDevice);
      await expect(device.save()).rejects.toThrow();
    });

    it('should fail without required name', async () => {
      const invalidDevice = {
        deviceId: 'DEVICE-001',
        type: 'PLC',
        brand: '三菱',
      };

      const device = new Device(invalidDevice);
      await expect(device.save()).rejects.toThrow();
    });

    it('should fail with invalid device type', async () => {
      const invalidDevice = {
        deviceId: 'DEVICE-001',
        name: '测试设备',
        type: 'INVALID_TYPE',
        brand: '西门子',
      };

      const device = new Device(invalidDevice);
      await expect(device.save()).rejects.toThrow();
    });

    it('should fail with invalid brand', async () => {
      const invalidDevice = {
        deviceId: 'DEVICE-001',
        name: '测试设备',
        type: 'PLC',
        brand: 'InvalidBrand',
      };

      const device = new Device(invalidDevice);
      await expect(device.save()).rejects.toThrow();
    });

    it('should fail with duplicate deviceId', async () => {
      const device1 = new Device({
        deviceId: 'UNIQUE-001',
        name: '设备1',
        type: 'PLC',
        brand: '西门子',
      });
      await device1.save();

      const device2 = new Device({
        deviceId: 'UNIQUE-001',
        name: '设备2',
        type: 'DCS',
        brand: '霍尼韦尔',
      });

      await expect(device2.save()).rejects.toThrow();
    });
  });

  describe('Read Device', () => {
    it('should find device by deviceId', async () => {
      const device = new Device({
        deviceId: 'FIND-001',
        name: '查询测试设备',
        type: 'PLC',
        brand: '欧姆龙',
      });
      await device.save();

      const foundDevice = await Device.findOne({ deviceId: 'FIND-001' });
      expect(foundDevice).toBeTruthy();
      expect(foundDevice.name).toBe('查询测试设备');
    });

    it('should find devices by status', async () => {
      await Device.create([
        { deviceId: 'STATUS-001', name: '在线设备', type: 'PLC', brand: '西门子', status: 'online' },
        { deviceId: 'STATUS-002', name: '离线设备', type: 'DCS', brand: '霍尼韦尔', status: 'offline' },
        { deviceId: 'STATUS-003', name: '告警设备', type: 'SENSOR', brand: '其他', status: 'warning' },
      ]);

      const onlineDevices = await Device.find({ status: 'online' });
      expect(onlineDevices).toHaveLength(1);
      expect(onlineDevices[0].deviceId).toBe('STATUS-001');
    });

    it('should find devices by type', async () => {
      await Device.create([
        { deviceId: 'TYPE-001', name: 'PLC设备', type: 'PLC', brand: '西门子' },
        { deviceId: 'TYPE-002', name: 'DCS设备', type: 'DCS', brand: '霍尼韦尔' },
        { deviceId: 'TYPE-003', name: '另一个PLC', type: 'PLC', brand: '三菱' },
      ]);

      const plcDevices = await Device.find({ type: 'PLC' });
      expect(plcDevices).toHaveLength(2);
    });

    it('should paginate results', async () => {
      await Device.create(
        Array.from({ length: 15 }, (_, i) => ({
          deviceId: `PAGE-${String(i).padStart(3, '0')}`,
          name: `分页测试设备${i + 1}`,
          type: 'PLC',
          brand: '西门子',
        }))
      );

      const page1 = await Device.find()
        .skip(0)
        .limit(10)
        .sort({ createdAt: -1 });
      const page2 = await Device.find()
        .skip(10)
        .limit(10)
        .sort({ createdAt: -1 });

      expect(page1).toHaveLength(10);
      expect(page2).toHaveLength(5);
    });
  });

  describe('Update Device', () => {
    it('should update device name', async () => {
      const device = await Device.create({
        deviceId: 'UPDATE-001',
        name: '原名称',
        type: 'PLC',
        brand: '西门子',
      });

      const updatedDevice = await Device.findByIdAndUpdate(
        device._id,
        { name: '更新后的名称' },
        { new: true }
      );

      expect(updatedDevice.name).toBe('更新后的名称');
    });

    it('should update device status', async () => {
      const device = await Device.create({
        deviceId: 'UPDATE-002',
        name: '状态测试设备',
        type: 'DCS',
        brand: '霍尼韦尔',
        status: 'offline',
      });

      const updatedDevice = await Device.findByIdAndUpdate(
        device._id,
        { status: 'online' },
        { new: true }
      );

      expect(updatedDevice.status).toBe('online');
      expect(updatedDevice.lastSeen).toBeDefined();
    });
  });

  describe('Delete Device', () => {
    it('should delete device by id', async () => {
      const device = await Device.create({
        deviceId: 'DELETE-001',
        name: '待删除设备',
        type: 'PLC',
        brand: '西门子',
      });

      await Device.findByIdAndDelete(device._id);
      const foundDevice = await Device.findOne({ deviceId: 'DELETE-001' });

      expect(foundDevice).toBeNull();
    });
  });

  describe('Device Indexes', () => {
    it('should have index on deviceId', async () => {
      const indexes = await Device.collection.indexes();
      const indexNames = indexes.map((idx) => idx.name);
      expect(indexNames).toContain('deviceId_1');
    });

    it('should have compound index on location', async () => {
      const indexes = await Device.collection.indexes();
      const locationIndex = indexes.find((idx) =>
        idx.key && idx.key['location.factory'] === 1 && idx.key['location.workshop'] === 1
      );
      expect(locationIndex).toBeDefined();
    });
  });
});