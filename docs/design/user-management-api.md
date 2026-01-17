---
docType: API
version: "1.0.0"
status: draft
created: 2026-01-17
updated: 2026-01-17
featureId: FEATURE-USER-MGMT
relatedDocs:
  - type: prd
    path: ../requirements/user-management-prd.md
  - type: architecture
    path: ./user-management-architecture.md
changeLog:
  - version: "1.0.0"
    date: 2026-01-17
    changes: 初始 API 设计
---

# 用户管理 (User Management) API 设计

> **设计规范**: [API_DESIGN.md](../../.agent/rules/backend/API_DESIGN.md)

## 1. API 概览

| Method | Endpoint                              | 描述                      | 权限  |
| ------ | ------------------------------------- | ------------------------- | ----- |
| GET    | /api/v1/users                         | 分页查询用户列表          | ADMIN |
| POST   | /api/v1/users                         | 创建新用户                | ADMIN |
| GET    | /api/v1/users/{userId}                | 查询用户详情              | ADMIN |
| PUT    | /api/v1/users/{userId}                | 更新用户信息              | ADMIN |
| DELETE | /api/v1/users/{userId}                | 删除用户 (逻辑删除)       | ADMIN |
| POST   | /api/v1/users/{userId}/reset-password | 重置用户密码 (Mock Email) | ADMIN |

---

## 2. API 详情

### 2.1 GET /api/v1/users

**描述**: 分页查询用户列表，支持按关键词搜索（姓名/邮箱）。

**权限**: `ROLE_ADMIN`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| size | int | 否 | 每页条数，默认 10 |
| keyword | string | 否 | 搜索关键词 (模糊匹配 username 或 email) |

**响应 200**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 50,
    "page": 1,
    "size": 10,
    "totalPages": 5,
    "content": [
      {
        "id": 123456789,
        "username": "zhangsan",
        "email": "zhangsan@example.com",
        "avatar": "https://example.com/avatar.jpg",
        "status": 1,
        "createdAt": "2026-01-15T10:00:00Z"
      }
    ]
  }
}
```

**状态码说明**:

- `status`: 1=正常, 0=禁用, 2=锁定

### 2.2 POST /api/v1/users

**描述**: 创建新用户。初始密码将自动生成或设为默认值（待定）。

**权限**: `ROLE_ADMIN`

**请求体**:

```json
{
  "username": "wangwu",
  "email": "wangwu@example.com",
  "avatar": "https://example.com/default-avatar.png"
}
```

**校验规则**:

- `username`: 必填, 2-50 字符
- `email`: 必填, 邮箱格式

**响应 200**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123456790,
    "username": "wangwu",
    "email": "wangwu@example.com",
    "status": 1,
    "createdAt": "..."
  }
}
```

### 2.3 PUT /api/v1/users/{userId}

**描述**: 更新用户信息（不包含密码）。

**权限**: `ROLE_ADMIN`

**请求体**:

```json
{
  "email": "new-email@example.com",
  "avatar": "https://new-avatar.url"
}
```

**响应 200**:

```json
{
  "code": 0,
  "message": "success",
  "data": { "id": 123, ... }
}
```

### 2.4 POST /api/v1/users/{userId}/reset-password

**描述**: 重置用户密码。当前版本为 Mock 实现，模拟发送邮件成功。

**权限**: `ROLE_ADMIN`

**请求体**: 无

**响应 200**:

```json
{
  "code": 0,
  "message": "重置邮件已发送（Mock）",
  "data": null
}
```

### 2.5 DELETE /api/v1/users/{userId}

**描述**: 归档/删除用户（逻辑删除）。

**权限**: `ROLE_ADMIN`

**响应 200**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 3. 错误码

| Code  | HTTP | 描述         |
| ----- | ---- | ------------ |
| 10001 | 409  | 用户名已存在 |
| 10002 | 404  | 用户不存在   |
| 10003 | 409  | 邮箱已注册   |

---

## ✅ 阶段确认

- [ ] API 符合 RESTful 规范
- [ ] 响应格式统一
- [ ] 错误码已定义
- [ ] 权限已标注

**确认人**: ******\_\_\_****** **日期**: ******\_\_\_******
