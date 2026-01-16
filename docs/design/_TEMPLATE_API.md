---
docType: API
version: "1.0.0"
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
featureId: FEATURE-XXX
relatedDocs:
  - type: prd
    path: ../requirements/[feature-name]-prd.md
  - type: architecture
    path: ./[feature-name]-architecture.md
changeLog:
  - version: "1.0.0"
    date: YYYY-MM-DD
    changes: 初始 API 设计
---

# [Feature Name] API 设计

> **设计规范**: [API_DESIGN.md](../../.agent/rules/backend/API_DESIGN.md) - API 设计部分

---

## 1. API 概览

| Method | Endpoint                 | 描述     | 权限  |
| ------ | ------------------------ | -------- | ----- |
| POST   | /api/v1/[resources]      | 创建资源 | USER  |
| GET    | /api/v1/[resources]      | 查询列表 | USER  |
| GET    | /api/v1/[resources]/{id} | 查询详情 | USER  |
| PUT    | /api/v1/[resources]/{id} | 更新资源 | USER  |
| DELETE | /api/v1/[resources]/{id} | 删除资源 | ADMIN |

---

## 2. API 详情

### 2.1 POST /api/v1/[resources]

**描述**: 创建新资源

**权限**: `ROLE_USER`

**请求体**:

```json
{
  "field1": "string (required, 3-50 chars)",
  "field2": "number (required)"
}
```

**响应 201**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "field1": "value",
    "createdAt": "2026-01-10T12:00:00Z"
  }
}
```

**错误码**:
| Code | HTTP | 描述 |
|------|------|------|
| 10001 | 400 | 参数校验失败 |
| 10002 | 409 | 资源已存在 |

---

### 2.2 GET /api/v1/[resources]

**描述**: 分页查询资源列表

**权限**: `ROLE_USER`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| size | int | 否 | 每页条数，默认 20 |
| sort | string | 否 | 排序，如 createdAt,desc |
| keyword | string | 否 | 搜索关键词 |

**响应 200**:

```json
{
  "code": 0,
  "data": {
    "content": [...],
    "page": 1,
    "size": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 2.3 GET /api/v1/[resources]/{id}

**描述**: 查询资源详情

**响应 200**:

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "field1": "value",
    "field2": 100,
    "createdAt": "2026-01-10T12:00:00Z",
    "updatedAt": "2026-01-10T12:00:00Z"
  }
}
```

**错误码**:
| Code | HTTP | 描述 |
|------|------|------|
| 10003 | 404 | 资源不存在 |

---

## 3. 通用错误码

| Code  | HTTP | 描述     |
| ----- | ---- | -------- |
| 0     | 200  | 成功     |
| 20001 | 401  | 未认证   |
| 20002 | 403  | 无权限   |
| 20003 | 500  | 系统错误 |

---

## ✅ 阶段确认

- [ ] API 符合 RESTful 规范
- [ ] 响应格式统一
- [ ] 错误码已定义
- [ ] 权限已标注

**确认人**: **\*\***\_\_\_**\*\*** **日期**: **\*\***\_\_\_**\*\***
