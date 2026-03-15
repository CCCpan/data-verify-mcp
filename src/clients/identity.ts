/**
 * 身份核验模块
 * Tools: verify_identity, verify_phone_three, verify_bank_card, face_compare
 */

import { parseIdCard, isValidIdCard, maskIdCard } from '../utils/id-parser.js';

// ============ 类型定义 ============

export interface IdentityVerifyParams {
  name: string;
  id_card: string;
}

export interface IdentityVerifyResult {
  is_match: boolean;
  name: string;
  id_card_masked: string;
  gender: string;
  age: number;
  birth_date: string;
  province: string;
  issuing_authority: string;
  valid_from: string;
  valid_to: string;
  request_id: string;
}

export interface PhoneThreeParams {
  name: string;
  id_card: string;
  phone: string;
}

export interface PhoneThreeResult {
  is_match: boolean;
  name: string;
  id_card_masked: string;
  phone_masked: string;
  carrier: string;
  phone_region: string;
  phone_status: string;
  request_id: string;
}

export interface BankCardParams {
  name: string;
  id_card: string;
  bank_card: string;
  phone?: string;
}

export interface BankCardResult {
  is_match: boolean;
  verify_type: string;
  name: string;
  id_card_masked: string;
  bank_card_masked: string;
  bank_name: string;
  card_type: string;
  card_level: string;
  request_id: string;
}

export interface FaceCompareParams {
  image_base64_1: string;
  image_base64_2: string;
}

export interface FaceCompareResult {
  similarity_score: number;
  is_same_person: boolean;
  confidence_level: string;
  face_quality_1: number;
  face_quality_2: number;
  request_id: string;
}

// ============ 预设数据 ============

const CARRIER_MAP: Record<string, string> = {
  '134': '中国移动', '135': '中国移动', '136': '中国移动', '137': '中国移动',
  '138': '中国移动', '139': '中国移动', '150': '中国移动', '151': '中国移动',
  '152': '中国移动', '157': '中国移动', '158': '中国移动', '159': '中国移动',
  '187': '中国移动', '188': '中国移动', '198': '中国移动',
  '130': '中国联通', '131': '中国联通', '132': '中国联通', '155': '中国联通',
  '156': '中国联通', '185': '中国联通', '186': '中国联通', '176': '中国联通',
  '133': '中国电信', '153': '中国电信', '177': '中国电信', '180': '中国电信',
  '181': '中国电信', '189': '中国电信', '199': '中国电信',
};

const PHONE_REGION_MAP: Record<string, string> = {
  '010': '北京', '021': '上海', '020': '广州', '0755': '深圳', '023': '重庆',
  '028': '成都', '027': '武汉', '025': '南京', '0571': '杭州', '029': '西安',
};

const BANK_MAP: Record<string, { name: string; type: string; level: string }> = {
  '621': { name: '中国工商银行', type: '借记卡', level: '金卡' },
  '622': { name: '中国建设银行', type: '借记卡', level: '普卡' },
  '623': { name: '中国农业银行', type: '借记卡', level: '普卡' },
  '625': { name: '中国银行', type: '借记卡', level: '白金卡' },
  '626': { name: '交通银行', type: '借记卡', level: '金卡' },
  '628': { name: '中国邮政储蓄银行', type: '借记卡', level: '普卡' },
  '400': { name: '招商银行', type: '信用卡', level: '金卡' },
  '512': { name: '中国工商银行', type: '信用卡', level: '白金卡' },
  '524': { name: '中国建设银行', type: '信用卡', level: '普卡' },
  '356': { name: '中国银行', type: '信用卡', level: '金卡' },
};

const ISSUING_AUTHORITIES = [
  '北京市公安局朝阳分局', '上海市公安局浦东分局', '广州市公安局天河分局',
  '深圳市公安局南山分局', '成都市公安局武侯分局', '杭州市公安局西湖分局',
  '武汉市公安局江汉分局', '南京市公安局玄武分局', '重庆市公安局渝中分局',
  '西安市公安局雁塔分局',
];

function generateRequestId(): string {
  return `REQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ============ 核验函数 ============

export async function verifyIdentity(params: IdentityVerifyParams): Promise<IdentityVerifyResult> {
  const { name, id_card } = params;

  if (!isValidIdCard(id_card)) {
    throw new Error('身份证号格式不正确，请输入18位有效身份证号码');
  }

  const idInfo = parseIdCard(id_card);
  const hash = hashCode(name + id_card);
  const isMatch = hash % 100 < 85; // 85%一致率

  const authorityIndex = hash % ISSUING_AUTHORITIES.length;

  return {
    is_match: isMatch,
    name,
    id_card_masked: maskIdCard(id_card),
    gender: idInfo.gender,
    age: idInfo.age,
    birth_date: idInfo.birthDate,
    province: idInfo.province,
    issuing_authority: ISSUING_AUTHORITIES[authorityIndex],
    valid_from: '2015-06-12',
    valid_to: '2035-06-12',
    request_id: generateRequestId(),
  };
}

export async function verifyPhoneThree(params: PhoneThreeParams): Promise<PhoneThreeResult> {
  const { name, id_card, phone } = params;

  if (!isValidIdCard(id_card)) {
    throw new Error('身份证号格式不正确，请输入18位有效身份证号码');
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    throw new Error('手机号格式不正确，请输入11位有效手机号码');
  }

  const hash = hashCode(name + id_card + phone);
  const isMatch = hash % 100 < 80;
  const prefix = phone.substring(0, 3);
  const carrier = CARRIER_MAP[prefix] || '中国移动';
  const regions = Object.values(PHONE_REGION_MAP);
  const region = regions[hash % regions.length];

  return {
    is_match: isMatch,
    name,
    id_card_masked: maskIdCard(id_card),
    phone_masked: phone.substring(0, 3) + '****' + phone.substring(7),
    carrier,
    phone_region: region,
    phone_status: '正常在用',
    request_id: generateRequestId(),
  };
}

export async function verifyBankCard(params: BankCardParams): Promise<BankCardResult> {
  const { name, id_card, bank_card, phone } = params;

  if (!isValidIdCard(id_card)) {
    throw new Error('身份证号格式不正确，请输入18位有效身份证号码');
  }
  if (!/^\d{15,19}$/.test(bank_card)) {
    throw new Error('银行卡号格式不正确，请输入15-19位银行卡号');
  }

  const verifyType = phone ? '四要素验证' : '三要素验证';
  const hash = hashCode(name + id_card + bank_card);
  const isMatch = hash % 100 < 82;
  const prefix = bank_card.substring(0, 3);
  const bankInfo = BANK_MAP[prefix] || { name: '招商银行', type: '借记卡', level: '金卡' };

  return {
    is_match: isMatch,
    verify_type: verifyType,
    name,
    id_card_masked: maskIdCard(id_card),
    bank_card_masked: bank_card.substring(0, 4) + ' **** **** ' + bank_card.substring(bank_card.length - 4),
    bank_name: bankInfo.name,
    card_type: bankInfo.type,
    card_level: bankInfo.level,
    request_id: generateRequestId(),
  };
}

export async function faceCompare(params: FaceCompareParams): Promise<FaceCompareResult> {
  const { image_base64_1, image_base64_2 } = params;

  if (!image_base64_1 || !image_base64_2) {
    throw new Error('请提供两张人脸图片的Base64编码');
  }

  const hash = hashCode(image_base64_1.substring(0, 50) + image_base64_2.substring(0, 50));
  const score = 60 + (hash % 35); // 60-94之间
  const isSame = score >= 75;
  let confidence: string;
  if (score >= 90) confidence = '极高';
  else if (score >= 80) confidence = '高';
  else if (score >= 70) confidence = '中';
  else confidence = '低';

  return {
    similarity_score: score,
    is_same_person: isSame,
    confidence_level: confidence,
    face_quality_1: 85 + (hash % 15),
    face_quality_2: 80 + ((hash >> 4) % 18),
    request_id: generateRequestId(),
  };
}
