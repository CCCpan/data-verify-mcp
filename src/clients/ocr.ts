// OCR 识别模块

// ============ 类型定义 ============

export type OcrType =
  | "id_card_front"
  | "id_card_back"
  | "bank_card"
  | "driver_license"
  | "vehicle_license";

export interface IdCardFrontFields {
  name: string;
  gender: string;
  ethnicity: string;
  birth_date: string;
  address: string;
  id_number: string;
}

export interface IdCardBackFields {
  issuing_authority: string;
  valid_from: string;
  valid_to: string;
}

export interface BankCardFields {
  card_number: string;
  bank_name: string;
  card_type: string;
}

export interface DriverLicenseFields {
  name: string;
  license_number: string;
  license_class: string;
  valid_from: string;
  valid_to: string;
}

export interface VehicleLicenseFields {
  plate_number: string;
  vehicle_type: string;
  owner: string;
  use_type: string;
  register_date: string;
  vin: string;
}

export type RecognizedFields =
  | IdCardFrontFields
  | IdCardBackFields
  | BankCardFields
  | DriverLicenseFields
  | VehicleLicenseFields;

export interface OcrResult {
  type: OcrType;
  confidence: number;
  recognized_fields: RecognizedFields;
  request_id: string;
}

// ============ 工具函数 ============

/**
 * 生成唯一请求ID
 * 格式: ocr-<时间戳>-<随机串>
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `ocr-${timestamp}-${randomPart}`;
}

// ============ 预设响应数据 ============

const PRESET_RESPONSE: Record<OcrType, { fields: RecognizedFields; baseConfidence: number }> = {
  id_card_front: {
    fields: {
      name: "张伟",
      gender: "男",
      ethnicity: "汉",
      birth_date: "1990-05-12",
      address: "北京市朝阳区建国路88号",
      id_number: "110105199005120531",
    } as IdCardFrontFields,
    baseConfidence: 96,
  },
  id_card_back: {
    fields: {
      issuing_authority: "北京市公安局朝阳分局",
      valid_from: "2020-03-15",
      valid_to: "2040-03-15",
    } as IdCardBackFields,
    baseConfidence: 97,
  },
  bank_card: {
    fields: {
      card_number: "6222 **** **** 1234",
      bank_name: "中国工商银行",
      card_type: "借记卡",
    } as BankCardFields,
    baseConfidence: 94,
  },
  driver_license: {
    fields: {
      name: "李明",
      license_number: "320106198803074517",
      license_class: "C1",
      valid_from: "2018-09-01",
      valid_to: "2024-09-01",
    } as DriverLicenseFields,
    baseConfidence: 93,
  },
  vehicle_license: {
    fields: {
      plate_number: "京A·12345",
      vehicle_type: "小型轿车",
      owner: "王芳",
      use_type: "非营运",
      register_date: "2021-06-20",
      vin: "LVSHDFAL5CE012345",
    } as VehicleLicenseFields,
    baseConfidence: 95,
  },
};

// ============ 核心识别函数 ============

/**
 * OCR 识别函数
 * 根据传入的图片 base64 编码和证件类型，返回结构化识别结果
 *
 * @param image_base64 - 图片的 base64 编码字符串
 * @param type - 证件类型
 * @returns OCR 识别结果
 */
export async function ocrRecognize(
  image_base64: string,
  type: OcrType
): Promise<OcrResult> {
  const preset = PRESET_RESPONSE[type];

  if (!preset) {
    throw new Error(`不支持的识别类型: ${type}`);
  }

  // 根据 image_base64 长度生成稳定的置信度偏移量（-2 ~ +2）
  const lengthSeed = image_base64.length % 5;
  const confidenceOffset = lengthSeed - 2;
  const confidence = Math.min(100, Math.max(0, preset.baseConfidence + confidenceOffset));

  // 模拟异步网络延迟
  await new Promise((resolve) => setTimeout(resolve, 50 + (image_base64.length % 100)));

  return {
    type,
    confidence,
    recognized_fields: { ...preset.fields },
    request_id: generateRequestId(),
  };
}
