---
docType: UIPrototype
version: "1.0.0"
status: draft
created: 2026-01-17
updated: 2026-01-17
featureId: FEATURE-SYS-CONF
relatedDocs:
  - type: prd
    path: ../requirements/system-configuration-prd.md
changeLog:
  - version: "1.0.0"
    date: 2026-01-17
    changes: Initial UI Prototype
---

# UI/UX 原型设计: 系统配置 (System Configuration)

> 对应 PRD: [system-configuration-prd.md](../requirements/system-configuration-prd.md)

## 1. 界面线框图 (Wireframes)

### 页面 1: 系统管理 (/systems/root)

管理一级系统（根节点）。展示为列表，支持新增、编辑、删除。

```
+-----------------------------------------------------------------------+
|  [Header] 系统配置 > 系统管理                                         |
+-----------------------------------------------------------------------+
|  [Filter: Keyword]                   [Button: Add System]             |
+-----------------------------------------------------------------------+
|  System Name         | Code          | Owner       | Actions          |
|----------------------+---------------+-------------+------------------|
|  账务系统            | ACC_SYS       | -           | Edit | Delete    |
|  客户中心            | CIF_SYS       | -           | Edit | Delete    |
|  ...                 | ...           | ...         | ...              |
+-----------------------------------------------------------------------+
|  [Pagination]                                                         |
+-----------------------------------------------------------------------+
```

### 页面 2: 子系统管理 (/systems/sub)

管理子系统。展示为列表，新增时需选择所属一级系统。

```
+-----------------------------------------------------------------------+
|  [Header] 系统配置 > 子系统管理                                       |
+-----------------------------------------------------------------------+
|  [Filter: Keyword]  [Filter: Main System]    [Button: Add Sub-System] |
+-----------------------------------------------------------------------+
|  Sub-System Name  | Main System   | Code        | Git Url | Actions   |
|-------------------+---------------+-------------+---------+-----------|
|  账务后端         | 账务系统      | ACC_BACKEND | git...  | Edit|Del  |
|  账务前端         | 账务系统      | ACC_FRONT   | git...  | Edit|Del  |
|  ...              | ...           | ...         | ...     | ...       |
+-----------------------------------------------------------------------+
|  [Pagination]                                                         |
+-----------------------------------------------------------------------+
```

#### 新增/编辑子系统模态框 (Modal)

```
+-------------------------------------------------------+
|  Add Sub-System                                   [X] |
+-------------------------------------------------------+
|  Main System*:   [ Select Main System (Dropdown)    v]|
|  Name*:          [ Input Name                       ] |
|  Code*:          [ Input Code (Global Unique)       ] |
|  Git Url*:       [ Input Git Url                    ] |
|  Owner:          [ Input Owner                      ] |
|                                                       |
|                  [Cancel]   [Save]                    |
+-------------------------------------------------------+
```

## 2. 视觉规范 (Visual Specifications)

> 引用 `.agent/rules/frontend/UI_DESIGN_SYSTEM.md`

| 组件/区域 | 对应 Token 方案 | 说明 |
| :-------------- | :----------------------------------------------| 组件/区域 | 对应 Token 方案 | 说明 |
| :--- | :--- | :--- |
| **Filter Bar** | `bg-surface`, `border-b` | 筛选区域 |
| **Data Table** | `table-striped`, `text-sm` | 数据展示 |
| **必填标识** | `text-danger` (\*) | 标注必填项 | | 标注 Git 地址等必填项 |

## 3. 交互说明 (Interaction / Behaviors)

### 关键流转

1.  **新增根节点 (Main System)**:
    - 进入“系统管理” (/systems/root)。
    - 点击 "Add System" -> 填写表单 -> API `POST /api/v1/main-systems`。

2.  **添加子系统 (Sub System)**:
    - 进入“子系统管理” (/systems/sub)。
    - 点击 "Add Sub-System" -> 选择主系统 (Main System) -> 填写信息 -> API `POST /api/v1/sub-systems`。

## 4. 响应式策略 (Responsive Strategy)

| 断点                | 布局调整                                                           |
| :------------------ | :----------------------------------------------------------------- | --- |
| **Mobile (<768px)** | 表格转为 Card List 视图。                                          |
| **Desktop**         | 标准表格视图。                                                     |     |
| :------------------ | :----------------------------------------------------------------- |
| **Mobile (<768px)** | 左侧树占满全屏；点击节点后，右侧表单覆盖显示 (Drawer/Modal 形式)。 |
| **Desktop**         | 标准左右分栏布局，左侧宽度固定 (e.g., 300px) 或可拖拽调整。        |
