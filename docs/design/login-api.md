---
docType: API
version: "1.0.0"
status: draft
created: 2026-01-16
updated: 2026-01-16
featureId: FEATURE-AUTH-001
relatedDocs:
  - type: prd
    path: ../requirements/login-prd.md
  - type: architecture
    path: ./login-architecture.md
changeLog:
  - version: "1.0.0"
    date: 2026-01-16
    changes: Initial Draft
---

# 登录模块 API 设计

> **设计规范**: [API_DESIGN.md](../../.agent/rules/backend/API_DESIGN.md)

---

## 1. API 概览

| Method | Endpoint            | 描述             | 权限      |
| ------ | ------------------- | ---------------- | --------- |
| POST   | /api/v1/auth/login  | 用户登录         | ANONYMOUS |
| POST   | /api/v1/auth/logout | 退出登录         | USER      |
| GET    | /api/v1/user/me     | 获取当前用户信息 | USER      |

---

## 2. API 详情

### 2.1 POST /api/v1/auth/login

**描述**: 用户名密码登录，换取 Access Token

**权限**: `ANONYMOUS`

**请求体**:

```json
{
  "username": "admin (required, string)",
  "password": "secret_password (required, string)"
}
```

**响应 200 (成功)**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhGciOiJIUzI1NiIsInR...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "ADMIN"
    }
  }
}
```

**响应 401 (认证失败)**:

- 密码错误
- 账号锁定
- 账号禁用

**错误码**:
| Code | HTTP | 描述 |
|---|---|---|
| 11001 | 401 | 用户名或密码错误 |
| 11004 | 401 | 账号已被锁定，请稍后重试 |
| 11005 | 401 | 账号已被禁用 |

---

### 2.2 POST /api/v1/auth/logout

**描述**: 退出登录，使得当前 Token 失效（若后端做黑名单，否则仅前端清除）

**权限**: `USER`

**请求头**: `Authorization: Bearer <token>`

**响应 200**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

### 2.3 GET /api/v1/user/me

**描述**: 获取当前登录用户的详细信息

**权限**: `USER`

**响应 200**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-01-01T12:00:00"
  }
}
```

---

## 3. 通用错误码

| Code  | HTTP | 描述         |
| ----- | ---- | ------------ |
| 0     | 200  | 成功         |
| 10001 | 400  | 参数格式错误 |
| 11001 | 401  | 认证失败     |
| 11003 | 403  | 权限不足     |
| 20000 | 500  | 系统内部错误 |

---

## ✅ 阶段确认

- [ ] API 符合 RESTful 规范
- [ ] 响应格式统一
- [ ] 错误码已定义
- [ ] 权限已标注
