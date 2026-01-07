import React from 'react';
import { 
  Server, 
  FileText, 
  Database, 
  Activity, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const stats = [
  { name: '在线设备', value: '128', icon: Server, color: 'bg-green-500' },
  { name: '文档总数', value: '2,456', icon: FileText, color: 'bg-blue-500' },
  { name: '数据点位', value: '10,234', icon: Database, color: 'bg-purple-500' },
  { name: '今日采集', value: '1.2M', icon: Activity, color: 'bg-teal-500' },
];

const alerts = [
  { id: 1, type: 'warning', message: 'PLC-003 通信延迟过高', time: '10:32' },
  { id: 2, type: 'error', message: '传感器 TEMP-001 读数异常', time: '09:45' },
  { id: 3, type: 'info', message: '系统备份完成', time: '08:00' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <span className="text-sm text-gray-500">最后更新: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Production Chart Placeholder */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">生产趋势</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-12 h-12 text-gray-300" />
            <span className="ml-2 text-gray-400">图表加载中...</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">系统告警</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg flex items-center ${
                  alert.type === 'error' ? 'bg-red-50' :
                  alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}