---
docType: DatabaseSchema
version: "1.0.0"
status: active
created: { { YYYY-MM-DD } }
updated: { { YYYY-MM-DD } }
---

# 数据库全量结构快照 (Database Schema Snapshot)

> 本文档作为数据库当前状态的**唯一可信源 (Single Source of Truth)**。所有的表结构变更必须先更新本文档，再生成 SQL 脚本。

## 变更记录

| 版本 (Date) | 变更说明 | 对应 Migration 脚本   | 作者   |
| :---------- | :------- | :-------------------- | :----- |
| v1.0.0      | 初始结构 | V1\_\_init_schema.sql | System |

---

## 1. 表结构概览

## 2. 表详情

### 2.1 `users` (用户表)

**描述**: 存储系统用户信息。

| 字段名       | 类型            | 长度 | 允许空 | 默认值                    | 描述     |
| :----------- | :-------------- | :--- | :----- | :------------------------ | :------- |
| `id`         | BIGINT UNSIGNED | 20   | NO     | AUTO_INCREMENT            | 主键 ID  |
| `created_at` | DATETIME        | -    | NO     | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | DATETIME        | -    | NO     | DEFAULT CURRENT_TIMESTAMP | 更新时间 |
| `username`   | VARCHAR         | 50   | NO     | -                         | 用户名   |

**索引**:

- `PRIMARY` (id)
- `uk_username` (username)

---

### 2.2 `{{table_name}}` ({{Chinese Name}})

**描述**: {{Description}}

| 字段名 | 类型            | 长度 | 允许空 | 默认值         | 描述    |
| :----- | :-------------- | :--- | :----- | :------------- | :------ |
| `id`   | BIGINT UNSIGNED | 20   | NO     | AUTO_INCREMENT | 主键 ID |
| ...    | ...             | ...  | ...    | ...            | ...     |

**索引**:

- `PRIMARY` (id)
- `idx_{{column}}` ({{column}})

---

## 3. 枚举定义

### 3.1 `UserStatus`

- `ACTIVE`: 正常
- `LOCKED`: 锁定

---
