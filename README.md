# RDT

React 19 + Spring Boot 3 纯净骨架，专为 AI 辅助开发设计。

## 技术栈

| 层级      | 技术                  |
| --------- | --------------------- |
| 前端框架  | React 19 + TypeScript |
| 构建工具  | Vite                  |
| 状态管理  | Zustand               |
| 路由      | React Router 7        |
| HTTP      | Axios (useRequest)    |
| 后端框架  | Spring Boot 3.2.x     |
| Java 版本 | 17+                   |
| 构建工具  | Maven (多模块)        |

## 项目结构

```
RDT/
├── rdt-frontend/          # React 19 前端
└── rdt-backend/           # Spring Boot 3 后端 (多模块)
    ├── rdt-common/        # 通用模块 (Result, 工具类)
    ├── rdt-api/           # API 接口模块 (DTO, VO)
    ├── rdt-service/       # 业务服务模块
    └── rdt-web/           # Web 启动模块
```

### 前端

- **框架**: React 19 + TypeScript + Vite
- **UI 库**: Tailwind CSS 4 + Shadcn UI (Optional)
- **状态管理**: Zustand
- **路由**: React Router 7
- **规范**: ESLint + Prettier + Husky + SonarJS

## 🛠 常用命令

### 后端

```bash
cd rdt-backend
mvn clean install              # 编译
mvn spring-boot:run -pl rdt-web  # 启动
```

### 前端

```bash
cd rdt-frontend
npm run dev          # 开发模式
npm run build        # 生产构建
npm run lint         # 代码检查 & 修复
npm run format       # 代码格式化
npm run audit        # 依赖安全审计
```

访问：http://localhost:5173

## 核心约定

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-01-09T08:00:00Z"
}
```

### API 前缀

所有后端接口统一使用 `/api/v1` 前缀。

### Axios 自动解包

前端 Axios 拦截器会自动解包 `data`，调用时直接获取业务数据：

```typescript
const users = await get<User[]>("/users");
```
