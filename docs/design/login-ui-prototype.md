---
docType: UI Prototype
version: "1.0.0"
status: draft
created: 2026-01-16
updated: 2026-01-16
featureId: FEATURE-AUTH-001
relatedDocs:
  - type: prd
    path: ../requirements/login-prd.md
changeLog:
  - version: "1.0.0"
    date: 2026-01-16
    changes: Initial Draft based on Prototype
---

# UI/UX 原型设计: 登录模块

> 对应 PRD: [login-prd.md](../requirements/login-prd.md)
> 原型参考: `prototype/login/code.html`

## 1. 界面线框图 (Wireframes)

### 登录页 (Split Screen Layout)

```
+-------------------------------------------------------+
| [Left Side: Branding]        | [Right Side: Form]     |
|                              |                        |
|  (Background: Dark Blue)     |  (Background: Transp.) |
|  (Effect: Graph Animation)   |                        |
|                              |  +------------------+  |
|  [Logo Icon] DevFlow         |  | [Glass Card]     |  |
|                              |  |                  |  |
|  Orchestrate                 |  |  Sign In         |  |
|  R&D Lifecycle               |  |  [Subtext]       |  |
|                              |  |                  |  |
|  [Metric Icon 1]             |  |  Email Input     |  |
|  [Metric Icon 2]             |  |  (@) placeholder |  |
|  [Metric Icon 3]             |  |                  |  |
|                              |  |  Password Input  |  |
|                              |  |  (lock)  (*)     |  |
|                              |  |        Forgot?   |  |
|                              |  |                  |  |
|                              |  |  [Sign In Btn]   |  |
|                              |  |  (Gradient)      |  |
|                              |  |                  |  |
|                              |  |  -- OR --        |  |
|                              |  |                  |  |
|                              |  |  [GitLab] [LDAP] |  |
|                              |  |                  |  |
|                              |  |  Request Access  |  |
|                              |  +------------------+  |
|                              |                        |
+-------------------------------------------------------+
```

## 2. 视觉规范 (Visual Specifications)

> 基于 `prototype/login/code.html` 的 Tailwind 配置

| 属性     | 值 / Token                | 说明                            |
| :------- | :------------------------ | :------------------------------ |
| **色彩** | `primary` (#1313ec)       | 主品牌色                        |
|          | `accent` (#137fec)        | 强调色，用于按钮渐变、Glow      |
|          | `bg-dark` (#0a0a10)       | 左侧背景、暗黑模式背景          |
|          | `bg-light` (#f0f0f5)      | 亮色模式背景                    |
| **圆角** | `rounded-xl` (12px)       | 输入框、按钮标准圆角            |
| **字体** | `Inter`                   | 主要字体                        |
| **特效** | `glass-card`              | 背景模糊 (blur-12px) + 半透明白 |
|          | `glow-effect`             | 蓝色外发光阴影                  |
|          | `text-glow`               | 文字发光效果                    |
| **图标** | Material Symbols Outlined | 统一图标库                      |

## 3. 交互说明 (Interaction / Behaviors)

### 状态变化

- **初始态**: 加载背景动画，输入框为空。
- **Focus**: 输入框获得焦点时，边框变为 `accent` 色，并带有轻微 Ring 效果。
- **Loading**: 点击登录后，按钮变为 Loading 状态 (Spinner)，禁用点击。
- **错误态**:
  - 输入校验失败: 输入框边框变红，下方显示错误提示。
  - 登录失败: 顶部出现 Toast 提示 "用户名或密码错误"。

### 关键流转

1.  **用户输入**:
    - Email: 校验格式。
    - Password: 掩码显示。
2.  **点击 Sign In**:
    - 前端校验非空。
    - 发送 API 请求。
    - **成功**: 跳转 Dashboard。
    - **失败**: 恢复按钮状态，清空密码框，显示 Toast。
3.  **第三方登录 (GitLab/LDAP)**:
    - V1.0 仅作 UI 展示，点击提示 "暂未开放"。

## 4. 响应式策略 (Responsive Strategy)

| 断点                   | 布局调整                                                   |
| :--------------------- | :--------------------------------------------------------- |
| **Mobile (<1024px)**   | 隐藏左侧 Branding 区域。右侧表单居中，背景使用 Dark 背景。 |
| **Desktop (>=1024px)** | 标准左右分栏布局。                                         |
