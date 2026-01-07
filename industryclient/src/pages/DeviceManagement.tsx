import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Power,
  Settings,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  brand: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  points: number;
}

const devices: Device[] = [
  { id: 'PLC-001', name: '主控制器', type: 'PLC', brand: '西门子', status: 'online', lastSeen: '2024-01-15 10:32:00', points: 256 },
  { id: 'PLC-002', name: '装配线控制器', type: 'PLC', brand: '三菱', status: 'online', lastSeen: '2024-01-15 10:31:45', points: 128 },
  { id: 'PLC-003', name: '包装线控制器', type: 'PLC', brand: '欧姆龙', status: 'warning', lastSeen: '2024-01-15 09:15:20', points: 64 },
  { id: 'DCS-001', name: '过程控制站', type: 'DCS', brand: '霍尼韦尔', status: 'online', lastSeen: '2024-01-15 10:32:10', points: 512 },
];

export default function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">设备管理</h1>
        <button className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
          <Plus className="w-5 h-5 mr-2" />
          添加设备
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索设备..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          筛选
        </button>
      </div>

      {/* Device Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据点位</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后通信</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDevices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    device.status === 'online' ? 'bg-green-100 text-green-800' :
                    device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {device.status === 'online' ? '在线' : device.status === 'warning' ? '警告' : '离线'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.points}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.lastSeen}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-teal-600">
                      <Power className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}