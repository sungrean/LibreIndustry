import React, { useState } from 'react';
import { 
  Link2, 
  Settings, 
  Plus, 
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'ERP' | 'MES' | 'WMS' | 'SCADA';
  protocol: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

const integrations: Integration[] = [
  { id: '1', name: 'SAP ERP', type: 'ERP', protocol: 'REST API', status: 'connected', lastSync: '2024-01-15 10:30:00' },
  { id: '2', name: '西门子 MES', type: 'MES', protocol: 'OPC UA', status: 'connected', lastSync: '2024-01-15 10:29:45' },
  { id: '3', name: '金蝶 WMS', type: 'WMS', protocol: 'REST API', status: 'disconnected', lastSync: '2024-01-14 18:00:00' },
  { id: '4', name: 'WinCC SCADA', type: 'SCADA', protocol: 'OPC UA', status: 'error', lastSync: '2024-01-15 09:15:00' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'disconnected': return <XCircle className="w-5 h-5 text-gray-400" />;
    case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
    default: return null;
  }
};

export default function Integration() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIntegrations = integrations.filter(int =>
    int.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">系统集成</h1>
        <button className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
          <Plus className="w-5 h-5 mr-2" />
          添加系统
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">已连接</p>
          <p className="text-2xl font-bold text-green-600">2</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">已断开</p>
          <p className="text-2xl font-bold text-gray-400">1</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">异常</p>
          <p className="text-2xl font-bold text-red-600">1</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">总数</p>
          <p className="text-2xl font-bold text-gray-900">4</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索集成系统..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Integration List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">系统名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">协议</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最后同步</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIntegrations.map((integration) => (
              <tr key={integration.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Link2 className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{integration.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{integration.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{integration.protocol}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(integration.status)}
                    <span className="ml-2 text-sm">{integration.status === 'connected' ? '已连接' : integration.status === 'disconnected' ? '已断开' : '异常'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{integration.lastSync}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600">
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