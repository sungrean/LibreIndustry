## 1. 目标
在 `industryclient` 目录下创建工业自动化智能体平台前端项目，参考 `client` 项目的技术栈（React/Vite/TypeScript），复用现有的 UI 组件、认证系统和文件处理功能。

## 2. 实施

### 第一阶段：项目基础架构和核心模块

- [ ] 1.1 初始化 industryclient 项目
  - `industryclient/`: 创建 Vite + React + TypeScript 项目
  - `industryclient/package.json`: 配置依赖（复用 client 的依赖版本）
  - `industryclient/vite.config.ts`: Vite 配置
  - `industryclient/tsconfig.json`: TypeScript 配置

- [ ] 1.2 集成复用的 client 组件
  - `industryclient/src/components/`: 链接复用 client 的 UI 组件
  - `industryclient/src/hooks/`: 链接复用 client 的 hooks
  - `industryclient/src/utils/`: 链接复用 client 的工具函数

- [ ] 1.3 基础布局和导航
  - `industryclient/src/components/Layout/`: 主布局组件
  - `industryclient/src/components/Sidebar/`: 侧边栏导航
  - `industryclient/src/pages/`: 页面入口

- [ ] 1.4 后端 API 模型
  - `api/models/Industry/`: 新增工业数据模型
    - `Device.js`: 设备模型
    - `DataPoint.js`: 数据点位模型
    - `Document.js`: 文档模型
    - `ThirdPartySystem.js`: 第三方系统模型

- [ ] 1.5 后端 API 路由
  - `api/routes/industry.js`: 工业功能 API 路由
  - `api/services/Industry/`: 工业数据处理服务

### 第二阶段：文档管理模块

- [ ] 2.1 文档上传组件
  - `industryclient/src/components/Document/Upload/`: 文档上传组件
  - 支持 PDF、Word、Excel、图片格式

- [ ] 2.2 文档预览组件
  - `industryclient/src/components/Document/Preview/`: 文档预览组件

- [ ] 2.3 文档管理页面
  - `industryclient/src/pages/Document/`: 文档管理页面

- [ ] 2.4 需求分析模块
  - `industryclient/src/components/Document/Analysis/`: 文档智能解析组件

### 第三阶段：设备管理模块

- [ ] 3.1 PLC 设备配置
  - `industryclient/src/components/Device/PLC/`: PLC 配置组件
  - 支持西门子、三菱、欧姆龙

- [ ] 3.2 设备状态监控
  - `industryclient/src/components/Device/Status/`: 设备状态组件
  - 在线/离线状态显示

- [ ] 3.3 数据点位管理
  - `industryclient/src/components/Device/DataPoint/`: 数据点位配置组件
  - 地址映射和数据类型配置

### 第四阶段：数据管理模块

- [ ] 4.1 数据库配置
  - `industryclient/src/pages/Settings/Database/`: 数据库配置页面

- [ ] 4.2 数据记录策略
  - `industryclient/src/components/Data/Strategy/`: 记录策略配置组件

- [ ] 4.3 存储统计
  - `industryclient/src/components/Data/Statistics/`: 存储统计组件
  - 数据占比分析和增长预估

### 第五阶段：第三方系统集成模块

- [ ] 5.1 系统配置
  - `industryclient/src/pages/Integration/Systems/`: 第三方系统配置页面
  - ERP、MES、WMS、SCADA

- [ ] 5.2 协议管理
  - `industryclient/src/components/Integration/Protocol/`: 协议配置组件
  - HTTP/HTTPS、OPCUA、MQTT、Modbus

### 第六阶段：设计器模块

- [ ] 6.1 生产看板设计器
  - `industryclient/src/components/Designer/Dashboard/`: 看板设计组件

- [ ] 6.2 报警配置设计器
  - `industryclient/src/components/Designer/Alarm/`: 报警配置组件

- [ ] 6.3 业务流程设计器
  - `industryclient/src/components/Designer/Workflow/`: 流程设计组件
  - 节点拖拽和连接线绘制