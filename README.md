[English](https://github.com/CCCpan/data-verify-mcp/blob/main/README_EN.md) | 中文

# 🔐 Data Verify MCP Server

[![npm version](https://img.shields.io/npm/v/data-verify-mcp.svg)](https://www.npmjs.com/package/data-verify-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **中国数据核验领域最全面的 MCP Server**，集成 **5大类 10项核验能力**，覆盖身份认证、企业征信、交通物流、智能OCR、风控评估全链路场景。
>
> 支持身份证实名认证、手机三要素验证、银行卡多要素核验、AI人脸比对、企业工商信息查询、企业风险穿透分析、车辆档案查询、车辆风控评分、多类型证件OCR智能识别、个人综合信用风险评估。适用于 KYC 合规审核、金融风控决策、企业尽职调查、物流车辆管理、证件信息自动化录入等业务场景。
>
> 开箱即用，一行命令接入 **OpenClaw / QClaw / Claude / Cursor / VSCode** 等主流 AI 工具，让你的 AI 助手具备专业级数据核验能力。

## ✨ 功能概览

| 分类 | Tool | 功能 |
|------|------|------|
| 🪪 **身份核验** | `verify_identity` | 身份证二要素核验（姓名+身份证号） |
| | `verify_phone_three` | 手机三要素验证（姓名+身份证+手机号） |
| | `verify_bank_card` | 银行卡三/四要素验证 |
| | `face_compare` | 人脸比对（两张照片比对） |
| 🏢 **企业核验** | `verify_enterprise` | 企业工商信息查询 |
| | `query_enterprise_risk` | 企业风险查询 |
| 🚗 **交通物流** | `query_vehicle_info` | 车辆信息查询 |
| | `vehicle_risk_score` | 车辆风控评分 |
| 📄 **OCR识别** | `ocr_recognize` | 证件OCR识别（身份证/银行卡/驾驶证/行驶证） |
| ⚠️ **风险评估** | `risk_assessment` | 个人综合风险评估 |

## 📦 快速开始

### 方式一：npx 直接使用（推荐）

无需安装，直接运行：

```bash
npx -y data-verify-mcp
```

### 方式二：npm 全局安装

```bash
npm install -g data-verify-mcp
data-verify-mcp
```

## 🔧 配置方式

### OpenClaw / QClaw / Claude Desktop / Cursor / Windsurf

在配置文件中添加：

```json
{
  "mcpServers": {
    "data-verify": {
      "command": "npx",
      "args": ["-y", "data-verify-mcp"],
      "env": {
        "DATA_VERIFY_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add data-verify -- npx -y data-verify-mcp
```

如需配置 Token：

```bash
claude mcp add data-verify -e DATA_VERIFY_ACCESS_TOKEN=your_token_here -- npx -y data-verify-mcp
```

### 自定义服务地址

```json
{
  "mcpServers": {
    "data-verify": {
      "command": "npx",
      "args": ["-y", "data-verify-mcp"],
      "env": {
        "DATA_VERIFY_API_BASE": "https://your-server.com/api",
        "DATA_VERIFY_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

---

## 📖 Tool 详细说明

### 🪪 身份核验

#### 1. `verify_identity` — 身份证二要素核验

通过姓名和身份证号码验证身份信息是否一致。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 真实姓名 |
| `id_card` | string | ✅ | 18位身份证号码 |

**使用示例：**

> "帮我核验一下张三的身份证号 110101199001011234 是否真实"

**返回示例：**

```json
{
  "code": "0",
  "msg": "核验成功",
  "data": {
    "match": true,
    "name": "张三",
    "id_card": "110101****1234",
    "gender": "男",
    "age": 36,
    "province": "北京市"
  }
}
```

---

#### 2. `verify_phone_three` — 手机三要素验证

验证姓名、身份证号和手机号三者是否一致。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 真实姓名 |
| `id_card` | string | ✅ | 18位身份证号码 |
| `phone` | string | ✅ | 11位手机号码 |

**使用示例：**

> "验证一下张三、身份证110101199001011234、手机号13800138000是否匹配"

**返回示例：**

```json
{
  "code": "0",
  "msg": "核验成功",
  "data": {
    "match": true,
    "name": "张三",
    "id_card": "110101****1234",
    "phone": "138****8000",
    "carrier": "移动"
  }
}
```

---

#### 3. `verify_bank_card` — 银行卡三/四要素验证

验证银行卡与身份信息是否一致，支持三要素（无手机号）和四要素（含手机号）两种模式。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 真实姓名 |
| `id_card` | string | ✅ | 18位身份证号码 |
| `bank_card` | string | ✅ | 银行卡号 |
| `phone` | string | ❌ | 预留手机号（传入则为四要素验证） |

**使用示例：**

> "核验银行卡6222021234567890123是否属于张三"

**返回示例：**

```json
{
  "code": "0",
  "msg": "核验成功",
  "data": {
    "match": true,
    "bank_name": "工商银行",
    "card_type": "借记卡",
    "name": "张三",
    "bank_card": "6222****0123"
  }
}
```

---

#### 4. `face_compare` — 人脸比对

比对两张人脸照片的相似度，判断是否为同一人。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `image_base64_1` | string | ✅ | 第一张人脸照片的 Base64 编码 |
| `image_base64_2` | string | ✅ | 第二张人脸照片的 Base64 编码 |

**使用示例：**

> "帮我比对这两张照片是不是同一个人"

**返回示例：**

```json
{
  "code": "0",
  "msg": "比对成功",
  "data": {
    "match": true,
    "score": 95.6,
    "threshold": 80,
    "conclusion": "同一人"
  }
}
```

---

### 🏢 企业核验

#### 5. `verify_enterprise` — 企业工商信息查询

根据企业名称或统一社会信用代码查询企业工商注册信息。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keyword` | string | ✅ | 企业名称或统一社会信用代码 |

**使用示例：**

> "查一下某某科技有限公司的工商信息"

**返回示例：**

```json
{
  "code": "0",
  "msg": "查询成功",
  "data": {
    "company_name": "某某科技有限公司",
    "credit_code": "91110000MA12345678",
    "legal_person": "李四",
    "registered_capital": "1000万人民币",
    "establishment_date": "2020-01-01",
    "status": "存续",
    "business_scope": "技术开发、技术咨询..."
  }
}
```

---

#### 6. `query_enterprise_risk` — 企业风险查询

查询企业的风险信息，包括司法风险、经营异常、行政处罚等。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keyword` | string | ✅ | 企业名称或统一社会信用代码 |

**使用示例：**

> "这家公司有没有什么风险记录？"

**返回示例：**

```json
{
  "code": "0",
  "msg": "查询成功",
  "data": {
    "company_name": "某某科技有限公司",
    "risk_level": "低风险",
    "risk_items": [
      {
        "type": "行政处罚",
        "count": 0
      },
      {
        "type": "经营异常",
        "count": 0
      },
      {
        "type": "司法风险",
        "count": 1,
        "detail": "被执行人记录1条"
      }
    ]
  }
}
```

---

### 🚗 交通物流

#### 7. `query_vehicle_info` — 车辆信息查询

根据车牌号查询车辆基本信息。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `plate_number` | string | ✅ | 车牌号码（如：京A12345） |

**使用示例：**

> "帮我查一下京A12345这辆车的信息"

**返回示例：**

```json
{
  "code": "0",
  "msg": "查询成功",
  "data": {
    "plate_number": "京A12345",
    "vehicle_type": "小型轿车",
    "brand": "大众",
    "model": "帕萨特",
    "engine_number": "L4****89",
    "register_date": "2021-06-15",
    "status": "正常"
  }
}
```

---

#### 8. `vehicle_risk_score` — 车辆风控评分

对车辆进行综合风控评分，用于二手车交易、车贷审批等场景。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `plate_number` | string | ✅ | 车牌号码 |
| `vin` | string | ❌ | 车辆识别号（VIN码），提供可提升准确度 |

**使用示例：**

> "评估一下这辆车京B67890的风险情况"

**返回示例：**

```json
{
  "code": "0",
  "msg": "评分成功",
  "data": {
    "plate_number": "京B67890",
    "risk_score": 85,
    "risk_level": "低风险",
    "details": {
      "accident_count": 1,
      "violation_count": 3,
      "transfer_count": 1,
      "mortgage_status": "无抵押"
    }
  }
}
```

---

### 📄 OCR识别

#### 9. `ocr_recognize` — 证件OCR识别

识别证件图片中的文字信息，支持多种证件类型。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `image_base64` | string | ✅ | 证件图片的 Base64 编码 |
| `doc_type` | string | ✅ | 证件类型：`id_card_front`（身份证正面）/ `id_card_back`（身份证反面）/ `bank_card`（银行卡）/ `driver_license`（驾驶证）/ `vehicle_license`（行驶证） |

**使用示例：**

> "识别一下这张身份证正面的信息"

**返回示例（身份证正面）：**

```json
{
  "code": "0",
  "msg": "识别成功",
  "data": {
    "doc_type": "id_card_front",
    "result": {
      "name": "张三",
      "gender": "男",
      "ethnicity": "汉",
      "birth_date": "1990-01-01",
      "address": "北京市朝阳区某某路1号",
      "id_card": "110101199001011234"
    },
    "confidence": 0.98
  }
}
```

---

### ⚠️ 风险评估

#### 10. `risk_assessment` — 个人综合风险评估

基于多维数据对个人进行综合风险评估，适用于信贷审核、租赁审核等场景。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 真实姓名 |
| `id_card` | string | ✅ | 18位身份证号码 |
| `phone` | string | ❌ | 手机号码（提供可增加评估维度） |

**使用示例：**

> "对张三做一个综合风险评估"

**返回示例：**

```json
{
  "code": "0",
  "msg": "评估成功",
  "data": {
    "name": "张三",
    "risk_score": 72,
    "risk_level": "中低风险",
    "dimensions": {
      "credit_risk": { "score": 80, "level": "低风险" },
      "fraud_risk": { "score": 65, "level": "中风险" },
      "legal_risk": { "score": 90, "level": "低风险" },
      "multi_lending": { "score": 55, "level": "中风险" }
    },
    "suggestion": "建议进一步核实申请人近期借贷情况"
  }
}
```

---

## 📋 使用额度

| 类型 | 额度 | 说明 |
|------|------|------|
| 免费（无 TOKEN） | 100 次/天 | 开箱即用，无需注册 |
| 注册用户（有 TOKEN） | 无限制 | 配置 DATA_VERIFY_ACCESS_TOKEN |

## ❓ FAQ

### Q: 需要注册才能使用吗？

不需要。默认提供每日 100 次免费调用额度，无需注册即可体验所有功能。如需更高额度，可注册获取 Token。

### Q: 支持哪些证件的 OCR 识别？

目前支持：身份证正面、身份证反面、银行卡、驾驶证、行驶证。

### Q: 人脸比对的图片格式有什么要求？

支持 JPG、PNG 格式，图片需转为 Base64 编码传入。建议图片大小不超过 2MB，人脸区域清晰可见。

### Q: 身份核验的数据是实时的吗？

是的，所有身份核验接口均为实时查询，确保数据的时效性和准确性。

### Q: 企业风险查询包含哪些维度？

包含司法风险（被执行人、失信人、裁判文书等）、经营异常、行政处罚、股权出质、动产抵押等多个维度。

### Q: 车辆风控评分的评估依据是什么？

综合考量车辆的事故记录、违章记录、过户次数、抵押状态、保险记录等多维数据进行评分。

### Q: 如何保障数据安全？

所有请求均通过 HTTPS 加密传输，敏感信息在返回时自动脱敏处理（如身份证号、手机号等部分隐藏），不存储任何用户提交的原始数据。

## 📬 联系我们

- 微信：chenganp
- 邮箱：345048305@qq.com

> 💡 需要定制开发自己的 MCP Server？查看我们的 [MCP 定制开发服务](https://github.com/CCCpan/mcp-custom-dev)


## 📄 许可证

[MIT](LICENSE)
