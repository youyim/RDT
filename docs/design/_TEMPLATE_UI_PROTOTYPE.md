# UI/UX 原型设计: {{Feature Name}}

> 对应 PRD: [Link to PRD]

## 1. 界面线框图 (Wireframes)

> 使用 ASCII Art 或 Mermaid 示意核心布局，关注功能区块而非细节。

### 页面 A: [Page Name]

```
+-------------------------------------------------------+
|  [Header] Logo         [Nav]               [Avatar]   |
+-------------------------------------------------------+
|  +----------------+   +---------------------------+   |
|  | [Sidebar]      |   | [Main Content Area]       |   |
|  | - Item 1       |   |                           |   |
|  | - Item 2       |   |  [Title H1]               |   |
|  |                |   |                           |   |
|  |                |   |  [Filter Bar]             |   |
|  |                |   |  (Search) (Date Range)    |   |
|  |                |   |                           |   |
|  |                |   |  [Data Table / Grid]      |   |
|  |                |   |  - Row 1                  |   |
|  |                |   |  - Row 2                  |   |
|  |                |   |                           |   |
|  +----------------+   +---------------------------+   |
+-------------------------------------------------------+
```

## 2. 视觉规范 (Visual Specifications)

> 引用 `.agent/rules/frontend/UI_DESIGN_SYSTEM.md` 中的 Tokens

| 组件/区域      | 对应 Token 方案                   | 说明             |
| :------------- | :-------------------------------- | :--------------- |
| **主操作按钮** | Use `color-primary`, `radius-sm`  | 页面最重要的 CTA |
| **次要按钮**   | Use `text-secondary`, `bg-subtle` | 取消、返回等操作 |
| **标题**       | `text-h1` for Page Title          | -                |

## 3. 交互说明 (Interaction / Behaviors)

### 状态变化

- **初始态**: 展示骨架屏 (Skeleton) 或 Loading Spinner。
- **空状态**: 当列表无数据时，展示 `EmptyState` 组件 (Image + Text + Action)。
- **错误态**: 接口失败时，Top Toast 提示。

### 关键流转

1.  **点击 [Create Button]**:
    - 弹出模态框 (Modal)。
    - 模态框包含表单: Name (Required), Type (Select)。
    - 点击 Confirm -> API Post -> Close Modal -> Refresh List.

## 4. 响应式策略 (Responsive Strategy)

| 断点                | 布局调整                                            |
| :------------------ | :-------------------------------------------------- |
| **Mobile (<768px)** | 侧边栏收起为 Hamburger Menu；表格转为卡片列表视图。 |
| **Desktop**         | 标准三栏布局。                                      |
