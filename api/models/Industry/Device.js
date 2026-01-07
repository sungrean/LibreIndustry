const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['PLC', 'DCS', 'SCADA', 'IOT', 'SENSOR', 'ROBOT', 'CNC', 'OTHER'],
    required: true,
  },
  brand: {
    type: String,
    enum: ['西门子', '三菱', '欧姆龙', '施耐德', 'ABB', '罗克韦尔', '霍尼韦尔', '发那科', '其他'],
    required: true,
  },
  model: {
    type: String,
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'warning', 'error'],
    default: 'offline',
  },
  connection: {
    protocol: {
      type: String,
      enum: ['S7', 'OPCUA', 'Modbus', 'MQTT', 'Ethernet/IP', 'Profinet', '其他'],
    },
    host: String,
    port: Number,
    rack: Number,
    slot: Number,
    timeout: {
      type: Number,
      default: 5000,
    },
  },
  location: {
    factory: String,
    workshop: String,
    line: String,
    position: String,
  },
  tags: [{
    tagId: String,
    name: String,
    address: String,
    dataType: {
      type: String,
      enum: ['BOOL', 'INT', 'DINT', 'REAL', 'STRING', 'TIME', 'DATE', 'DT'],
    },
    rw: {
      type: String,
      enum: ['R', 'W', 'RW'],
    },
    description: String,
  }],
  metadata: {
    serialNumber: String,
    manufactureDate: Date,
    installDate: Date,
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

DeviceSchema.index({ status: 1 });
DeviceSchema.index({ type: 1 });
DeviceSchema.index({ 'location.factory': 1, 'location.workshop': 1 });

module.exports = mongoose.model('IndustryDevice', DeviceSchema);