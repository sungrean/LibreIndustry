import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Clock, 
  TrendingUp,
  Settings,
  Play,
  Pause
} from 'lucide-react';

const storageStats = [
  { name: '已使用存储', value: '256 GB', total: '512 GB', percentage: 50 },
  { name: '历史数据', value: '128 GB', type: '时序数据' },
  { name: '文档存储', value: '64 GB', type: '文件存储' },
  { name: '配置数据', value: '32 GB', type: '关系数据' },
];

const strategies = [
  { id: '1', name: '高频采集策略', interval: '100ms', retention: '7天', enabled: true },
  { id: '2', name: '标准采集策略', interval: '1s', retention: '30天', enabled: true },
  { id: '3', name: '低频采集策略', interval: '1min', retention: '1年', enabled: false },
];

export default function DataManagement() {
  const [selectedStrategy, setSelectedStrategy] = useState('2');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">数据管理</h1>
        <button className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
          <Settings className="w-5 h-5 mr-2" />
          配置
        </button>
      </div>

      {/* Storage Overview */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center mb-6">
          <Database className="w-6 h-6 text-teal-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">存储概览</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">存储使用率</span>
              <span className="text-sm font-medium text-gray-700">256 GB / 512 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-teal-600 h-4 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          {storageStats.slice(1).map((stat) => (
            <div key={stat.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <HardDrive className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-500">{stat.type}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Strategies */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-teal-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">采集策略</h2>
        </div>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div 
              key={strategy.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedStrategy === strategy.id 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    strategy.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{strategy.name}</h3>
                    <p className="text-sm text-gray-500">采集间隔: {strategy.interval} | 保留: {strategy.retention}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-lg ${
                    strategy.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {strategy.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Growth */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-teal-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">数据增长趋势</h2>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">趋势图表加载中...</span>
        </div>
      </div>
    </div>
  );
}