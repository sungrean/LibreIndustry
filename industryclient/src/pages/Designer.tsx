import React, { useState } from 'react';
import { 
  PenTool, 
  LayoutDashboard, 
  Bell, 
  GitBranch,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', name: '看板设计', icon: LayoutDashboard },
  { id: 'alarm', name: '报警配置', icon: Bell },
  { id: 'workflow', name: '流程设计', icon: GitBranch },
];

export default function Designer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">设计器</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Undo className="w-5 h-5 mr-2" />
            撤销
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Redo className="w-5 h-5 mr-2" />
            重做
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ZoomOut className="w-5 h-5 mr-2" />
            缩小
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ZoomIn className="w-5 h-5 mr-2" />
            放大
          </button>
          <button className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
            <Save className="w-5 h-5 mr-2" />
            保存
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Designer Canvas */}
      <div className="flex gap-6">
        {/* Toolbox */}
        <div className="w-64 bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-4">组件库</h3>
          <div className="space-y-2">
            {activeTab === 'dashboard' && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">文本标签</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">数值显示</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">折线图</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">柱状图</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">仪表盘</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">饼图</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">表格</div>
              </>
            )}
            {activeTab === 'alarm' && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">告警文本</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">告警列表</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">状态指示灯</div>
              </>
            )}
            {activeTab === 'workflow' && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">开始节点</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">处理节点</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">条件节点</div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100">结束节点</div>
              </>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-white rounded-xl shadow-sm">
          <div className="h-[600px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">拖拽组件到此处进行设计</p>
              <p className="text-sm text-gray-300 mt-1">支持鼠标滚轮缩放</p>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="w-72 bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-4">属性配置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">组件名称</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="请输入名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X坐标</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Y坐标</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">宽度</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">高度</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}