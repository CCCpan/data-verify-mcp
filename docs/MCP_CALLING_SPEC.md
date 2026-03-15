# Data Verify MCP - AI 调用规范

> 本文档指导 AI 在什么场景下使用哪个 Tool，以及如何组合使用。

## 一、何时使用本 MCP

当用户提到以下关键词或场景时，应使用 data-verify-mcp：

- 实名认证、身份核验、KYC、身份证验证
- 手机号验证、三要素、运营商查询
- 银行卡验证、四要素、开户行查询
- 人脸比对、人像对比、活体检测
- 企业查询、工商信息、企业风险、失信被执行人
- 车辆查询、车牌查询、车辆风控
- 证件OCR、身份证识别、银行卡识别、驾驶证识别
- 风险评估、信用评分、多头借贷

## 二、Tool 选择矩阵

| 用户意图 | 推荐 Tool | 备注 |
|---------|-----------|------|
| 验证某人身份是否真实 | `verify_identity` | 需要姓名+身份证号 |
| 验证手机号是否本人的 | `verify_phone_three` | 需要姓名+身份证+手机号 |
| 验证银行卡是否本人的 | `verify_bank_card` | 3要素或4要素 |
| 比对两张照片是否同一人 | `face_compare` | 需要两张base64图片 |
| 查询企业工商信息 | `verify_enterprise` | 企业名称或信用代码 |
| 查询企业是否有风险 | `query_enterprise_risk` | 黑名单/处罚/失信 |
| 查询车辆信息 | `query_vehicle_info` | 需要车牌号 |
| 评估车辆风险 | `vehicle_risk_score` | 需要车牌号 |
| 识别证件上的文字 | `ocr_recognize` | 支持5种证件类型 |
| 评估个人信用风险 | `risk_assessment` | 姓名+身份证，手机号可选 |

## 三、各 Tool 调用规范

### 3.1 verify_identity（身份证二要素核验）

**触发条件：** 用户要求验证姓名和身份证号是否匹配
**参数：**
- `name`（必填）：中文姓名
- `id_card`（必填）：18位身份证号

**注意：** 身份证号必须是18位，最后一位可以是X

### 3.2 verify_phone_three（手机三要素验证）

**触发条件：** 用户要求验证手机号是否为本人
**参数：**
- `name`（必填）：中文姓名
- `id_card`（必填）：18位身份证号
- `phone`（必填）：11位手机号

### 3.3 verify_bank_card（银行卡要素验证）

**触发条件：** 用户要求验证银行卡是否为本人
**参数：**
- `name`（必填）：中文姓名
- `id_card`（必填）：18位身份证号
- `bank_card`（必填）：15-19位银行卡号
- `phone`（可选）：提供则为四要素验证，不提供则为三要素验证

### 3.4 face_compare（人脸比对）

**触发条件：** 用户要求比对两张照片是否为同一人
**参数：**
- `image_base64_1`（必填）：第一张照片base64编码
- `image_base64_2`（必填）：第二张照片base64编码

**注意：** 照片应为正面人脸，清晰度越高结果越准确

### 3.5 verify_enterprise（企业工商信息查询）

**触发条件：** 用户要查询某企业的基本信息
**参数（二选一）：**
- `enterprise_name`：企业名称
- `credit_code`：统一社会信用代码

### 3.6 query_enterprise_risk（企业风险查询）

**触发条件：** 用户要了解某企业是否存在风险
**参数（二选一）：**
- `enterprise_name`：企业名称
- `credit_code`：统一社会信用代码

### 3.7 query_vehicle_info（车辆信息查询）

**触发条件：** 用户要查询某车辆的基本信息
**参数：**
- `plate_number`（必填）：车牌号，如"京A12345"
- `plate_color`（可选）：车牌颜色，默认蓝色

### 3.8 vehicle_risk_score（车辆风控评分）

**触发条件：** 用户要评估某车辆的风险等级
**参数：**
- `plate_number`（必填）：车牌号
- `plate_color`（可选）：车牌颜色，默认蓝色

### 3.9 ocr_recognize（证件OCR识别）

**触发条件：** 用户要识别证件图片上的文字信息
**参数：**
- `image_base64`（必填）：证件图片base64编码
- `type`（必填）：证件类型
  - `id_card_front`：身份证正面（姓名、性别、民族、出生日期、地址、身份证号）
  - `id_card_back`：身份证背面（签发机关、有效期）
  - `bank_card`：银行卡（卡号、银行名、卡类型）
  - `driver_license`：驾驶证（姓名、证号、准驾车型、有效期）
  - `vehicle_license`：行驶证（车牌号、车辆类型、所有人、使用性质、注册日期）

### 3.10 risk_assessment（个人综合风险评估）

**触发条件：** 用户要评估某人的信用风险
**参数：**
- `name`（必填）：中文姓名
- `id_card`（必填）：18位身份证号
- `phone`（可选）：11位手机号，提供后评估更准确

## 四、常见场景 Tool 组合

### 场景1：完整KYC流程
```
1. verify_identity → 验证身份证
2. verify_phone_three → 验证手机号
3. verify_bank_card → 验证银行卡
4. face_compare → 人脸比对（如有照片）
```

### 场景2：企业尽职调查
```
1. verify_enterprise → 查询企业基本信息
2. query_enterprise_risk → 查询企业风险状况
```

### 场景3：二手车评估
```
1. query_vehicle_info → 查询车辆基本信息
2. vehicle_risk_score → 查询车辆风控评分
```

### 场景4：贷款审批
```
1. verify_identity → 身份核验
2. risk_assessment → 个人风险评估
3. verify_bank_card → 银行卡验证
```

### 场景5：证件信息录入
```
1. ocr_recognize (id_card_front) → 识别身份证正面
2. ocr_recognize (id_card_back) → 识别身份证背面
3. verify_identity → 用OCR结果核验身份
```

## 五、错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 参数格式错误 | 提示用户修正参数格式（如身份证18位、手机号11位） |
| 服务异常 | 告知用户稍后重试 |
| 核验不一致 | 如实告知结果，建议用户核对信息是否正确 |
