# LibreChat 测试指导文档

本文档为 LibreChat 项目提供全面的测试指导，包括测试框架、工具、目录结构、执行命令、编写规范以及 CI/CD 集成等内容。

## 目录

1. [测试框架与工具](#测试框架与工具)
2. [测试目录结构说明](#测试目录结构说明)
3. [测试执行命令](#测试执行命令)
4. [各类测试的编写规范](#各类测试的编写规范)
5. [测试数据管理](#测试数据管理)
6. [Mock 与 Stub 使用方式](#mock-与-stub-使用方式)
7. [CI/CD 中的测试集成](#cicd-中的测试集成)

---

## 测试框架与工具

### 后端 API 测试

后端 API 使用以下测试框架和工具：

| 工具 | 用途 | 版本 |
|------|------|------|
| [Jest](https://jestjs.io/) | 单元测试和集成测试框架 | ^30.2.0 |
| [supertest](https://github.com/ladjs/supertest) | HTTP 断言测试 | ^7.1.0 |
| [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) | MongoDB 内存服务器（用于测试） | ^10.1.4 |

**主要依赖：**
- `jest` - 测试运行器
- `supertest` - HTTP API 测试
- `mongodb-memory-server` - 提供内存中的 MongoDB 实例用于测试

### 前端测试

前端项目（client/ 目录）使用以下测试工具：

| 工具 | 用途 | 版本 |
|------|------|------|
| [Jest](https://jestjs.io/) | 测试运行器 | ^30.2.0 |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro) | React 组件测试 | ^14.0.0 |
| [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro) | DOM 测试工具 | ^9.3.0 |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) | 用户事件模拟 | ^14.4.3 |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Jest 自定义断言 | ^5.16.5 |
| [jest-environment-jsdom](https://github.com/jsdom/jsdom) | JSDOM 测试环境 | ^29.7.0 |
| [jest-canvas-mock](https://github.com/hustcc/jest-canvas-mock) | Canvas API Mock | ^2.5.2 |

### 工业自动化客户端测试

工业自动化客户端（industryclient/ 目录）当前没有内置测试配置，建议后续添加 Jest 测试配置。

---

## 测试目录结构说明

### 后端 API 测试结构

```
api/
├── jest.config.js                 # Jest 配置文件
├── test/
│   ├── jestSetup.js              # 测试初始化设置
│   ├── .env.test                 # 测试环境变量
│   ├── .env.test.example         # 测试环境变量示例
│   ├── __mocks__/                # 通用 Mock 文件
│   │   ├── logger.js             # Winston 日志 Mock
│   │   ├── openid-client.js      # OpenID Client Mock
│   │   └── auth.mock.json        # 认证 Mock 数据
│   └── index.js                  # 测试入口文件
├── app/
│   └── clients/
│       └── prompts/
│           └── formatMessages.spec.js  # 客户端提示格式化测试
├── models/
│   ├── Conversation.spec.js      # Conversation 模型测试
│   ├── Message.spec.js           # Message 模型测试
│   ├── File.spec.js              # File 模型测试
│   └── ...
├── routes/
│   └── __tests__/                # 路由集成测试
│       ├── config.spec.js
│       ├── convos.spec.js
│       ├── ldap.spec.js
│       ├── mcp.spec.js
│       └── static.spec.js
├── middleware/
│   └── ...
├── services/
│   ├── ActionService.spec.js
│   ├── PermissionService.spec.js
│   └── ...
├── utils/
│   └── import/
│       ├── importers.spec.js
│       ├── importers-timestamp.spec.js
│       └── __data__/             # 测试数据文件
│           ├── chatbotui-export.json
│           ├── chatgpt-export.json
│           └── ...
└── ...
```

### 前端测试结构

```
client/
├── src/
│   ├── __tests__/                # 测试文件目录
│   │   └── ...
│   └── ...
└── ...
```

### 测试文件命名规范

| 文件类型 | 命名模式 | 示例 |
|----------|----------|------|
| 单元测试 | `*.spec.js` | `formatMessages.spec.js` |
| 集成测试 | `*.integration.test.js` | `openWeather.integration.test.js` |
| 测试 Mock | `__mocks__/` | `logger.js` |

---

## 测试执行命令

### 后端 API 测试命令

所有命令需在 `api/` 目录下执行，或使用 `cd api && npm run <command>`。

| 命令 | 描述 |
|------|------|
| `npm run test` | 运行所有测试（观察模式） |
| `npm run test:ci` | 运行所有测试（CI 模式，无观察） |
| `npm run b:test` | 使用 Bun 运行时运行测试 |

**示例：**
```bash
# 运行所有测试
cd api && npm run test

# CI 环境运行测试
cd api && npm run test:ci

# 使用 Bun 运行
cd api && npm run b:test
```

### 前端测试命令

所有命令需在 `client/` 目录下执行。

| 命令 | 描述 |
|------|------|
| `npm run test` | 运行所有测试（观察模式） |
| `npm run test:ci` | 运行所有测试（CI 模式） |
| `npm run b:test` | 使用 Bun 运行时运行测试（观察模式） |
| `npm run typecheck` | TypeScript 类型检查 |

**示例：**
```bash
# 运行前端测试
cd client && npm run test

# CI 环境运行前端测试
cd client && npm run test:ci

# TypeScript 类型检查
cd client && npm run typecheck
```

### 工业自动化客户端测试命令

**注意：** industryclient 当前没有内置测试配置，建议后续添加。

### 运行特定测试

```bash
# 运行单个测试文件
cd api && npx jest path/to/test.spec.js

# 运行特定测试套件
cd api && npx jest --testNamePattern="saveConvo"

# 运行匹配特定模式的测试
cd api && npx jest -t "formatMessage"
```

---

## 各类测试的编写规范

### 单元测试规范

#### 基本结构

每个测试文件应包含：
1. 导入依赖
2. 描述测试套件
3. `beforeAll` / `beforeEach` 初始化
4. 测试用例
5. `afterAll` / `afterEach` 清理

**示例：**
```javascript
const { formatMessage } = require('./formatMessages');

describe('formatMessage', () => {
  it('should format user message correctly', () => {
    const input = {
      message: {
        sender: 'user',
        text: 'Hello',
      },
      userName: 'John',
    };
    const result = formatMessage(input);
    expect(result).toEqual({
      role: 'user',
      content: 'Hello',
      name: 'John',
    });
  });
});
```

#### 测试用例命名

使用描述性名称，遵循以下模式：
- "should [expected behavior] when [condition]"
- "should [action] correctly"
- "should handle [edge case]"

**示例：**
```javascript
it('should sanitize the name by replacing invalid characters', () => {
  // 测试代码
});

it('should trim the name to a maximum length of 64 characters', () => {
  // 测试代码
});
```

### 模型测试规范

使用 `mongodb-memory-server` 进行数据库操作测试。

**示例：**
```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Conversation } = require('~/db/models');

describe('Conversation Operations', () => {
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
    await Conversation.deleteMany({});
  });
});
```

### 路由集成测试规范

使用 `supertest` 进行 API 端点测试。

**示例：**
```javascript
const request = require('supertest');
const express = require('express');
const convosRouter = require('./convos');

describe('Conversations API', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/convos', convosRouter);
  });

  it('GET / should return conversations list', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body).toHaveProperty('conversations');
  });
});
```

### 前端组件测试规范

使用 React Testing Library 进行组件测试。

**示例：**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 最佳实践

1. **测试隔离**：每个测试应独立运行，不依赖其他测试
2. **单一职责**：每个测试用例只测试一个行为
3. **避免实现细节**：测试行为，而非实现
4. **使用描述性断言**：
   - 使用 `toEqual` 而非 `toBe` 比较对象/数组
   - 使用专门的匹配器（如 `toBeInTheDocument`）
5. **Mock 外部依赖**：
   - 数据库操作
   - HTTP 请求
   - 文件系统操作
6. **设置合理的超时**：测试默认超时为 30 秒

---

## 测试数据管理

### 测试环境变量

测试使用 `api/test/.env.test` 文件配置环境变量：

```bash
# 复制示例文件
cp api/test/.env.test.example api/test/.env.test
```

**必需的环境变量：**

| 变量 | 描述 | 示例值 |
|------|------|--------|
| `MONGO_URI` | MongoDB 连接字符串 | `mongodb://127.0.0.1:27017/dummy-uri` |
| `JWT_SECRET` | JWT 密钥 | `test` |
| `JWT_REFRESH_SECRET` | JWT 刷新密钥 | `test` |
| `CREDS_KEY` | 凭证加密密钥 | `test` |
| `CREDS_IV` | 凭证加密 IV | `test` |
| `BAN_VIOLATIONS` | 启用违规检查 | `true` |
| `CI` | CI 模式 | `true` |

### 测试数据文件

测试数据存放在 `api/utils/import/__data__/` 目录：

- `chatbotui-export.json` - ChatbotUI 导出格式
- `chatgpt-export.json` - ChatGPT 导出格式
- `chatgpt-tree.json` - ChatGPT 树形结构格式
- `librechat-export.json` - LibreChat 导出格式
- `librechat-linear.json` - LibreChat 线性格式
- `librechat-tree.json` - LibreChat 树形格式

### Mock 数据

Mock 数据存放在 `api/test/__mocks__/` 目录：

- `auth.mock.json` - Google Auth 认证 Mock 数据
- `logger.js` - Winston 日志 Mock
- `openid-client.js` - OpenID Client Mock

---

## Mock 与 Stub 使用方式

### 全局 Mock 配置

在 `api/test/jestSetup.js` 中配置：

```javascript
// 设置全局测试超时
jest.setTimeout(30000);

// 配置环境变量
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/dummy-uri';
process.env.CI = 'true';
process.env.JWT_SECRET = 'test';
```

### Winston Logger Mock

```javascript
// api/test/__mocks__/logger.js
jest.mock('winston', () => {
  return {
    format: {
      colorize: jest.fn(),
      combine: jest.fn(),
      timestamp: jest.fn(),
      printf: jest.fn(),
    },
    createLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    }),
    transports: {
      Console: jest.fn(),
      DailyRotateFile: jest.fn(),
    },
  };
});
```

### OpenID Client Mock

```javascript
// api/test/__mocks__/openid-client.js
module.exports = {
  Issuer: {
    discover: jest.fn().mockResolvedValue({
      Client: jest.fn().mockImplementation(() => ({
        authorizationUrl: jest.fn().mockReturnValue('mock_auth_url'),
        callback: jest.fn().mockResolvedValue({
          access_token: 'mock_access_token',
        }),
      })),
    }),
  },
  Strategy: jest.fn().mockImplementation((options, verify) => {
    return { name: 'openid-mock-strategy' };
  }),
};
```

### 在测试中使用 Mock

```javascript
// 方式 1：使用 jest.mock() 自动 Mock
jest.mock('winston');

// 方式 2：在 describe 块中 Mock
describe('My Service', () => {
  beforeEach(() => {
    jest.mock('~/config', () => ({
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
      },
    }));
  });
});

// 方式 3：使用 jest.spyOn() 部分 Mock
it('should call logger', () => {
  const logger = require('winston');
  const spy = jest.spyOn(logger, 'info').mockImplementation();
  // 测试代码
  spy.mockRestore();
});
```

### Mock 消息模型

```javascript
jest.mock('./Message');
const { getMessages, deleteMessages } = require('./Message');

beforeEach(() => {
  getMessages.mockResolvedValue([]);
  deleteMessages.mockResolvedValue({ deletedCount: 1 });
});
```

---

## CI/CD 中的测试集成

### GitHub Actions 工作流

#### 后端测试工作流

`.github/workflows/backend-review.yml` 配置：

```yaml
name: Backend Unit Tests
on:
  pull_request:
    branches:
      - main
      - dev
      - dev-staging
      - release/*
    paths:
      - 'api/**'
      - 'packages/**'

jobs:
  tests_Backend:
    name: Run Backend unit tests
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    env:
      MONGO_URI: ${{ secrets.MONGO_URI }}
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      NODE_ENV: CI
      NODE_OPTIONS: '--max-old-space-size=6144'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Data Provider
        run: npm run build:data-provider
      
      - name: Build Data Schemas
        run: npm run build:data-schemas
      
      - name: Build API
        run: npm run build:api
      
      - name: Run unit tests (API)
        run: cd api && npm run test:ci
      
      - name: Run unit tests (data-provider)
        run: cd packages/data-provider && npm run test:ci
      
      - name: Run unit tests (data-schemas)
        run: cd packages/data-schemas && npm run test:ci
```

### 必需 Secrets 配置

在 GitHub 仓库 Settings 中配置以下 Secrets：

| Secret 名称 | 描述 |
|-------------|------|
| `MONGO_URI` | MongoDB 连接字符串 |
| `OPENAI_API_KEY` | OpenAI API 密钥（用于测试） |
| `JWT_SECRET` | JWT 密钥 |
| `CREDS_KEY` | 凭证加密密钥 |
| `CREDS_IV` | 凭证加密 IV |
| `BAN_VIOLATIONS` | 是否启用违规检查 |
| `BAN_DURATION` | 封禁时长 |
| `BAN_INTERVAL` | 封禁间隔 |
| `NODE_MAX_OLD_SPACE_SIZE` | Node.js 最大内存（可选） |

### 触发条件

测试工作流在以下情况自动触发：

- 向 `main`、`dev`、`dev-staging`、`release/*` 分支提交 PR 时
- 修改 `api/` 或 `packages/` 目录下的文件时

### 测试报告

Jest 支持生成多种格式的测试报告：

```javascript
// jest.config.js
module.exports = {
  // 其他配置...
};
```

测试运行时会自动生成覆盖率报告在 `api/coverage/` 目录。

### 最佳实践

1. **并行测试**：在 CI 中尽可能并行运行独立测试
2. **快速反馈**：优化测试执行时间，目标 < 10 分钟
3. **幂等性**：确保测试可重复执行
4. **隔离环境**：每个 CI 运行使用独立的测试环境
5. **缓存优化**：缓存 node_modules 和构建产物
6. **覆盖率监控**：设置代码覆盖率阈值

---

## 快速开始

### 1. 安装依赖

```bash
# 安装根目录依赖
npm ci

# 构建必需的包
npm run build:data-provider
npm run build:data-schemas
npm run build:api
```

### 2. 配置测试环境

```bash
# 复制测试环境变量示例
cp api/test/.env.test.example api/test/.env.test

# 创建空的 auth.json 文件
mkdir -p api/data
echo '{}' > api/data/auth.json
```

### 3. 运行测试

```bash
# 运行后端测试
cd api && npm run test

# 运行前端测试
cd client && npm run test

# CI 模式运行
cd api && npm run test:ci
```

### 4. 编写新测试

1. 在相应目录创建 `*.spec.js` 文件
2. 导入被测试的模块
3. 使用 `describe()` 组织测试用例
4. 使用 `it()` 或 `test()` 编写具体测试
5. 运行测试验证

---

## 常见问题

### Q: 测试运行失败，显示数据库连接错误

A: 确保 `api/test/.env.test` 文件存在且 `MONGO_URI` 配置正确。

### Q: 如何跳过某些测试

A: 使用 `it.skip()` 或 `describe.skip()`：

```javascript
it.skip('this test will be skipped', () => {
  // ...
});
```

### Q: 如何调试测试

A: 使用 `console.log` 或 Node.js 调试器：

```bash
cd api && npx jest --verbose --no-coverage test.spec.js
```

### Q: 如何增加测试超时时间

A: 在测试文件中设置：

```javascript
jest.setTimeout(60000); // 60 秒
```

或单个测试：

```javascript
it('long running test', async () => {
  jest.setTimeout(60000);
  // 测试代码
}, 60000); // 额外的超时参数
```

---

## 相关资源

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro)
- [Supertest 文档](https://github.com/ladjs/supertest)
- [MongoDB Memory Server 文档](https://github.com/nodkz/mongodb-memory-server)
- [LibreChat GitHub Actions 配置](.github/workflows/)