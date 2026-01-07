import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Database,
  Server,
  Shield,
  Bell,
  User,
  Save,
  RefreshCw
} from 'lucide-react';

const settingsSections = [
  { id: 'general', name: '常规设置', icon: SettingsIcon },
  { id: 'database', name: '数据库配置', icon: Database },
  { id: 'device', name: '设备通信', icon: Server },
  { id: 'security', name: '安全设置', icon: Shield },
  { id: 'notifications', name: '通知设置', icon: Bell },
  { id: 'account', name: '账户设置', icon: User },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState({
    systemName: '工业自动化平台',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    autoSave: true,
    dataRetention: '90',
  });

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64">
        <nav className="space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <section.icon className="w-5 h-5 mr-3" />
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-sm">
          {activeSection === 'general' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">常规设置</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">系统名称</label>
                  <input
                    type="text"
                    value={formData.systemName}
                    onChange={(e) => setFormData({...formData, systemName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时区</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSave"
                    checked={formData.autoSave}
                    onChange={(e) => setFormData({...formData, autoSave: e.target.checked})}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="autoSave" className="ml-2 text-sm text-gray-700">自动保存</label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">数据库配置</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数据库类型</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="influxdb">InfluxDB (时序数据)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">主机地址</label>
                  <input
                    type="text"
                    placeholder="localhost"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">端口</label>
                  <input
                    type="number"
                    placeholder="5432"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数据保留天数</label>
                  <input
                    type="number"
                    value={formData.dataRetention}
                    onChange={(e) => setFormData({...formData, dataRetention: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  测试连接
                </button>
              </div>
            </div>
          )}

          {activeSection === 'device' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">设备通信配置</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">PLC 通信</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">西门子 S7 端口</label>
                      <input type="number" defaultValue="102" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">超时时间(ms)</label>
                      <input type="number" defaultValue="5000" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">OPC UA</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">安全策略</label>
                      <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                        <option value="None">None</option>
                        <option value="Basic256">Basic256</option>
                        <option value="Aes128_Sha256_RsaOaep">Aes128_Sha256_RsaOaep</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">认证模式</label>
                      <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                        <option value="anonymous">匿名</option>
                        <option value="username">用户名/密码</option>
                        <option value="certificate">证书</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'security' || activeSection === 'notifications' || activeSection === 'account') && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {settingsSections.find(s => s.id === activeSection)?.name}
              </h2>
              <p className="text-gray-500">此模块正在开发中...</p>
            </div>
          )}

          {/* Save Button */}
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
            <button className="flex items-center px-6 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <Save className="w-5 h-5 mr-2" />
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}