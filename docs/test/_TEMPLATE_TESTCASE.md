---
docType: TestCase
version: "1.0.0"
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
featureId: FEATURE-XXX
relatedDocs:
  - type: prd
    path: ../requirements/[feature-name]-prd.md
  - type: api
    path: ../design/[feature-name]-api.md
testCoverage:
  unit: 0%
  integration: 0%
  e2e: 0%
changeLog:
  - version: "1.0.0"
    date: YYYY-MM-DD
    changes: 初始测试用例
---

# [Feature Name] 测试用例

---

## 1. 测试概览

| 类型     | 数量 | 通过 | 失败 | 跳过 |
| -------- | ---- | ---- | ---- | ---- |
| 单元测试 | 0    | 0    | 0    | 0    |
| API 测试 | 0    | 0    | 0    | 0    |
| E2E 测试 | 0    | 0    | 0    | 0    |

---

## 2. 单元测试用例

### TC-U001: [Service 方法名] - 正常场景

- **优先级**: P0
- **测试对象**: `[ServiceClass].[method]`
- **Given**: [前置条件/Mock 数据]
- **When**: [调用方法]
- **Then**: [预期结果]
- **状态**: [ ] PASS / FAIL

---

## 3. API 测试用例

### TC-A001: [API 名称] - 正常流程

- **优先级**: P0
- **Endpoint**: `POST /api/v1/[resource]`
- **Given**: [前置条件]
- **When**: 发送请求
  ```json
  {
    "field1": "value"
  }
  ```
- **Then**:
  - HTTP Status: 201
  - Response:
    ```json
    {
      "code": 0,
      "data": {...}
    }
    ```
- **状态**: [ ] PASS / FAIL

---

### TC-A002: [API 名称] - 参数校验失败

- **优先级**: P0
- **Endpoint**: `POST /api/v1/[resource]`
- **Given**: 请求参数不完整
- **When**: 发送请求
- **Then**:
  - HTTP Status: 400
  - Error Code: 10001
- **状态**: [ ] PASS / FAIL

---

### TC-A003: [API 名称] - 权限不足

- **优先级**: P1
- **Endpoint**: `DELETE /api/v1/[resource]/{id}`
- **Given**: 用户无 ADMIN 权限
- **When**: 发送删除请求
- **Then**:
  - HTTP Status: 403
  - Error Code: 20002
- **状态**: [ ] PASS / FAIL

---

## 4. E2E 测试用例

### TC-E001: [用户流程名称]

- **优先级**: P0
- **前置条件**: 用户已登录
- **测试步骤**:
  1. 打开列表页
  2. 点击新建按钮
  3. 填写表单
  4. 点击提交
- **预期结果**: 提示创建成功，列表中出现新数据
- **状态**: [ ] PASS / FAIL

---

## 5. 边界测试用例

### TC-B001: [字段] - 最大长度

- **场景**: 输入 50 个字符（最大限制）
- **预期**: 保存成功
- **状态**: [ ] PASS / FAIL

### TC-B002: [字段] - 超出长度

- **场景**: 输入 51 个字符
- **预期**: 校验失败，提示字符超长
- **状态**: [ ] PASS / FAIL

---

## 6. 测试执行记录

| TC ID   | 用例名称 | 执行日期 | 执行人 | 结果 | 备注 |
| ------- | -------- | -------- | ------ | ---- | ---- |
| TC-A001 |          |          |        |      |      |

---

## ✅ 阶段确认

- [ ] 测试用例覆盖所有验收标准
- [ ] 边界条件已测试
- [ ] 异常场景已测试
- [ ] 可以进入验证阶段

**确认人**: ******\_\_\_****** **日期**: ******\_\_\_******
