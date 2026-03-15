[中文](https://github.com/CCCpan/data-verify-mcp/blob/main/README.md) | English

# 🔐 data-verify-mcp

[![npm version](https://img.shields.io/npm/v/data-verify-mcp.svg)](https://www.npmjs.com/package/data-verify-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The most comprehensive MCP Server for Chinese data verification**, integrating **5 categories with 10 verification tools** — covering identity authentication, enterprise credit, vehicle logistics, intelligent OCR, and risk assessment.

Seamlessly integrates with **OpenClaw / QClaw / Claude / Cursor / VSCode** and other mainstream AI tools, empowering your AI assistant with professional-grade data verification capabilities.

## Features

| Category | Tools | Description |
|---|---|---|
| Identity Verification | 4 | ID card, phone, bank card verification & face comparison |
| Enterprise Verification | 2 | Business info query & enterprise risk check |
| Vehicle | 2 | Vehicle information query & risk scoring |
| OCR Recognition | 1 | Document OCR for ID cards, bank cards, licenses |
| Risk Assessment | 1 | Comprehensive personal risk assessment |

## Quick Start

### Run directly with npx

```bash
npx data-verify-mcp@latest
```

### Install globally

```bash
npm install -g data-verify-mcp
data-verify-mcp
```

## Configuration

You need to set the `DATA_VERIFY_API_KEY` environment variable to authenticate API requests.

### OpenClaw / QClaw / Claude Desktop

Add the following to your Claude Desktop configuration file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "data-verify-mcp": {
      "command": "npx",
      "args": ["-y", "data-verify-mcp@latest"],
      "env": {
        "DATA_VERIFY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add data-verify-mcp -e DATA_VERIFY_API_KEY=your-api-key -- npx -y data-verify-mcp@latest
```

### Cursor / Windsurf

Add to your Cursor MCP configuration (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "data-verify-mcp": {
      "command": "npx",
      "args": ["-y", "data-verify-mcp@latest"],
      "env": {
        "DATA_VERIFY_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tools

### Identity Verification

#### `verify_identity`

ID card two-element verification — checks whether a name matches an ID number.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name |
| `id_number` | string | Yes | 18-digit ID card number |

#### `verify_phone_three`

Phone three-element verification — checks whether name, ID number, and phone number match.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name |
| `id_number` | string | Yes | 18-digit ID card number |
| `phone` | string | Yes | 11-digit mobile phone number |

#### `verify_bank_card`

Bank card three/four-element verification — validates bank card holder information.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name |
| `id_number` | string | Yes | 18-digit ID card number |
| `bank_card` | string | Yes | Bank card number |
| `phone` | string | No | Mobile phone number (4-element mode) |

#### `face_compare`

Face comparison — compares two face photos and returns a similarity score.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `photo_a` | string | Yes | Base64-encoded first photo |
| `photo_b` | string | Yes | Base64-encoded second photo |

### Enterprise Verification

#### `verify_enterprise`

Enterprise business information query — retrieves registration details by company name or credit code.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `keyword` | string | Yes | Company name or unified social credit code |

#### `query_enterprise_risk`

Enterprise risk check — queries risk records such as legal proceedings and penalties.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `keyword` | string | Yes | Company name or unified social credit code |

### Vehicle

#### `query_vehicle_info`

Vehicle information query — retrieves vehicle details by plate number or VIN.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `plate_number` | string | No | License plate number |
| `vin` | string | No | Vehicle identification number (VIN) |

> At least one of `plate_number` or `vin` must be provided.

#### `vehicle_risk_score`

Vehicle risk scoring — evaluates risk level based on vehicle and owner information.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `plate_number` | string | Yes | License plate number |
| `vin` | string | Yes | Vehicle identification number (VIN) |
| `owner_name` | string | Yes | Vehicle owner name |

### OCR Recognition

#### `ocr_recognize`

Document OCR recognition — extracts text fields from various document types.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `image` | string | Yes | Base64-encoded document image |
| `doc_type` | string | Yes | Document type: `id_card_front`, `id_card_back`, `bank_card`, `driver_license`, `vehicle_license` |

### Risk Assessment

#### `risk_assessment`

Comprehensive personal risk assessment — evaluates an individual's overall risk profile.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name |
| `id_number` | string | Yes | 18-digit ID card number |
| `phone` | string | No | Mobile phone number |

## FAQ

**Q: How do I obtain an API key?**
A: Contact the service provider to apply for an API key, then set it via the `DATA_VERIFY_API_KEY` environment variable.

**Q: Which regions are supported?**
A: This service is designed for Chinese data verification scenarios, including mainland China ID cards, phone numbers, enterprises, and vehicles.

**Q: What image formats are supported for OCR?**
A: JPEG and PNG formats are supported. Images must be Base64-encoded before being passed to the tool.

**Q: Is there a rate limit?**
A: Rate limits depend on your API plan. Refer to your service agreement for details.

## Contact

- WeChat: chenganp
- Email: 345048305@qq.com

> 💡 Need a custom MCP Server? Check out our [MCP Development Service](https://github.com/CCCpan/mcp-custom-dev)

## License

[MIT](LICENSE)
