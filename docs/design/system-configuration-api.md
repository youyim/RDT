# API 设计文档: 系统配置 (System Configuration)

> 对应 PRD: [system-configuration-prd.md](../requirements/system-configuration-prd.md)
> 对应架构: [system-configuration-architecture.md](./system-configuration-architecture.md)

## 1. 接口概览

| Method          | Endpoint                    | 描述           | 权限  |
| --------------- | --------------------------- | -------------- | ----- |
| **Main System** |                             |                |       |
| POST            | `/api/v1/main-systems`      | 创建主系统     | ADMIN |
| GET             | `/api/v1/main-systems`      | 查询主系统列表 | USER  |
| GET             | `/api/v1/main-systems/{id}` | 查询主系统详情 | USER  |
| PUT             | `/api/v1/main-systems/{id}` | 更新主系统     | ADMIN |
| DELETE          | `/api/v1/main-systems/{id}` | 删除主系统     | ADMIN |
| **Sub System**  |                             |                |       |
| POST            | `/api/v1/sub-systems`       | 创建子系统     | ADMIN |
| GET             | `/api/v1/sub-systems`       | 查询子系统列表 | USER  |
| GET             | `/api/v1/sub-systems/{id}`  | 查询子系统详情 | USER  |
| PUT             | `/api/v1/sub-systems/{id}`  | 更新子系统     | ADMIN |
| DELETE          | `/api/v1/sub-systems/{id}`  | 删除子系统     | ADMIN |

## 2. 接口详情

### 2.1 主系统管理 (Main System)

#### POST /api/v1/main-systems

创建主系统。

**请求 Body**:

```json
{
  "name": "账务系统",
  "code": "ACC_SYS",
  "description": "核心账务处理",
  "owner": "John"
}
```

#### GET /api/v1/main-systems

查询主系统列表。

**Query Params**:

- `keyword`: (可选) 搜索关键词
- `page`: (可选) 默认 1
- `size`: (可选) 默认 10

**响应**:

```json
{
  "code": 0,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "账务系统",
        "code": "ACC_SYS",
        "description": "...",
        "owner": "John"
      }
    ],
    "total": 1
  }
}
```

### 2.2 子系统管理 (Sub System)

#### POST /api/v1/sub-systems

创建子系统。

**请求 Body**:

```json
{
  "mainSystemId": 1,
  "name": "账务后端",
  "code": "ACC_BACKEND",
  "gitUrl": "https://git...",
  "owner": "Doe"
}
```

#### GET /api/v1/sub-systems

查询子系统列表。

**Query Params**:

- `mainSystemId`: (可选) 按主系统筛选
- `keyword`: (可选) 搜索关键词
- `page`: (可选) 默认 1
- `size`: (可选) 默认 10

**响应**:

```json
{
  "code": 0,
  "data": {
    "content": [
      {
        "id": 10,
        "mainSystemId": 1,
        "mainSystemName": "账务系统",
        "name": "账务后端",
        "code": "ACC_BACKEND",
        "gitUrl": "https://git...",
        "owner": "Doe"
      }
    ],
    "total": 1
  }
}
```

## 3. 错误码 (Error Codes)

| 错误码  | 描述                       |
| :------ | :------------------------- |
| `10001` | 参数校验失败               |
| `10002` | 系统编码已存在             |
| `10003` | 系统不存在                 |
| `10004` | 无法删除（存在关联子系统） |
