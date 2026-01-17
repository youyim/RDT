# Database Schema Snapshot

> **Last Updated**: 2026-01-17
> **Description**: Global Single Source of Truth for Database Schema.

## Change Log

| Version | Date       | Description                             | Author      |
| :------ | :--------- | :-------------------------------------- | :---------- |
| V1      | 2026-01-17 | Initial User Schema                     | System      |
| V2      | 2026-01-17 | Add System Configuration Tables (Split) | Antigravity |

## Tables

### 1. `sys_main_system` (主系统表)

| Column      | Type            | Nullable | Comment           |
| :---------- | :-------------- | :------- | :---------------- |
| id          | bigint unsigned | NO       | PK                |
| name        | varchar(50)     | NO       | 系统名称          |
| code        | varchar(50)     | NO       | 系统编码 (Unique) |
| description | varchar(255)    | YES      | 描述              |
| owner       | varchar(50)     | YES      | 负责人            |
| status      | tinyint(4)      | NO       | 状态: 1=启用      |
| created_at  | datetime        | NO       |                   |
| updated_at  | datetime        | NO       |                   |
| deleted_at  | datetime        | YES      |                   |

### 2. `sys_sub_system` (子系统表)

| Column         | Type            | Nullable | Comment                  |
| :------------- | :-------------- | :------- | :----------------------- |
| id             | bigint unsigned | NO       | PK                       |
| main_system_id | bigint unsigned | NO       | FK -> sys_main_system.id |
| name           | varchar(50)     | NO       | 子系统名称               |
| code           | varchar(50)     | NO       | 子系统编码 (Unique)      |
| description    | varchar(255)    | YES      |                          |
| git_url        | varchar(255)    | NO       | Git地址                  |
| owner          | varchar(50)     | YES      | 负责人                   |
| status         | tinyint(4)      | NO       |                          |
| created_at     | datetime        | NO       |                          |
| updated_at     | datetime        | NO       |                          |
| deleted_at     | datetime        | YES      |                          |
