---
docType: Implementation
version: "1.0.0"
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
featureId: FEATURE-XXX
relatedDocs:
  - type: design
    path: ../design/[feature-name]-architecture.md
  - type: api
    path: ../design/[feature-name]-api.md
  - type: coding-standards
    path: ../../.agent/rules/backend/JAVA_CODING_STANDARDS.md
changeLog:
  - version: "1.0.0"
    date: YYYY-MM-DD
    changes: 初始实现规范
---

# [Feature Name] 实现规范

> **编码规范**: [JAVA_CODING_STANDARDS.md](../../.agent/rules/backend/JAVA_CODING_STANDARDS.md) | [REACT_CODING_STANDARDS.md](../../.agent/rules/frontend/REACT_CODING_STANDARDS.md)

---

## 1. 后端实现清单

### 1.1 Entity 层

| 类名     | 文件路径                    | 状态 |
| -------- | --------------------------- | ---- |
| [Entity] | domain/entity/[Entity].java | [ ]  |

### 1.2 DTO/VO 层

| 类名        | 用途     | 文件路径                    | 状态 |
| ----------- | -------- | --------------------------- | ---- |
| [CreateDTO] | 创建请求 | domain/dto/[Create]DTO.java | [ ]  |
| [UpdateDTO] | 更新请求 | domain/dto/[Update]DTO.java | [ ]  |
| [VO]        | 响应     | domain/vo/[VO].java         | [ ]  |

### 1.3 Repository 层

| 类名     | 文件路径             | 状态 |
| -------- | -------------------- | ---- |
| [Mapper] | mapper/[Mapper].java | [ ]  |

### 1.4 Service 层

| 类名          | 文件路径                        | 状态 |
| ------------- | ------------------------------- | ---- |
| [Service]     | service/[Service].java          | [ ]  |
| [ServiceImpl] | service/impl/[ServiceImpl].java | [ ]  |

### 1.5 Controller 层

| 类名         | 文件路径                     | 状态 |
| ------------ | ---------------------------- | ---- |
| [Controller] | controller/[Controller].java | [ ]  |

---

## 2. 前端实现清单

### 2.1 API 层

| 文件                | 状态 |
| ------------------- | ---- |
| src/api/[module].ts | [ ]  |

### 2.2 类型定义

| 文件                    | 状态 |
| ----------------------- | ---- |
| src/types/[module].d.ts | [ ]  |

### 2.3 Store

| 文件                        | 状态 |
| --------------------------- | ---- |
| src/stores/[module]Store.ts | [ ]  |

### 2.4 Views/Components

| 文件                          | 职责   | 状态 |
| ----------------------------- | ------ | ---- |
| src/views/[module]/List.tsx   | 列表页 | [ ]  |
| src/views/[module]/Detail.tsx | 详情页 | [ ]  |
| src/views/[module]/Form.tsx   | 表单页 | [ ]  |

---

## 3. 代码质量检查

| 检查项     | 命令                   | 结果 |
| ---------- | ---------------------- | ---- |
| ESLint     | `npm run lint`         | [ ]  |
| TypeScript | `npm run type-check`   | [ ]  |
| PMD        | `mvn pmd:check`        | [ ]  |
| Checkstyle | `mvn checkstyle:check` | [ ]  |
| Unit Tests | `mvn test`             | [ ]  |

---

## 4. 关键实现说明

### 4.1 [实现要点 1]

[关键实现逻辑说明]

### 4.2 [实现要点 2]

[关键实现逻辑说明]

---

## ✅ 阶段确认

- [ ] 后端实现完成
- [ ] 前端实现完成
- [ ] 代码质量检查通过
- [ ] 可以进入测试阶段

**确认人**: **\*\***\_\_\_**\*\*** **日期**: **\*\***\_\_\_**\*\***
