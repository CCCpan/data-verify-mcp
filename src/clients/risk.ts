import { isValidIdCard, maskIdCard } from '../utils/id-parser.js';

// ============================================================
// 类型定义
// ============================================================

/** 风险等级 */
type RiskLevel = '低风险' | '中风险' | '高风险' | '极高风险';

/** 逾期风险等级 */
type OverdueRisk = '低' | '中' | '高';

/** 风险评估请求参数 */
interface RiskAssessmentParams {
  /** 姓名 */
  name: string;
  /** 身份证号 */
  id_card: string;
  /** 手机号（可选） */
  phone?: string;
}

/** 风险评估返回结果 */
interface RiskAssessmentResult {
  /** 姓名 */
  name: string;
  /** 脱敏身份证号 */
  id_card_masked: string;
  /** 综合风险评分 0-100，越高越危险 */
  risk_score: number;
  /** 风险等级 */
  risk_level: RiskLevel;
  /** 多头借贷指数 0-100 */
  multi_loan_index: number;
  /** 法院执行记录数 */
  court_execution_count: number;
  /** 逾期风险等级 */
  overdue_risk: OverdueRisk;
  /** 信用建议 */
  credit_suggestion: string;
  /** 风险标签 */
  risk_tags: string[];
  /** 综合风险描述 */
  risk_detail: string;
  /** 请求唯一标识 */
  request_id: string;
}

// ============================================================
// 工具函数
// ============================================================

/**
 * 生成唯一请求ID
 * 格式: RISK-时间戳-随机串
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `RISK-${timestamp}-${random}`;
}

/**
 * 基于字符串生成稳定的哈希值（简易版）
 * 同样的输入始终返回同样的数值，范围 0 ~ 2^31-1
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(hash);
}

/**
 * 将哈希值映射到 [min, max] 范围内的整数
 */
function hashRange(hash: number, min: number, max: number): number {
  return min + (hash % (max - min + 1));
}

// ============================================================
// 预置响应 & Mock 逻辑
// ============================================================

/** 可选风险标签池 */
const RISK_TAG_POOL: string[] = [
  '多头借贷',
  '频繁申请',
  '短期集中申请',
  '夜间高频操作',
  '跨地区消费异常',
  '收入负债比偏高',
  '历史逾期',
  '司法涉诉',
  '信用卡透支率高',
  '近期负债攀升',
];

/**
 * 根据风险评分推导风险等级
 */
function deriveRiskLevel(score: number): RiskLevel {
  if (score <= 25) return '低风险';
  if (score <= 50) return '中风险';
  if (score <= 75) return '高风险';
  return '极高风险';
}

/**
 * 根据风险评分推导逾期风险等级
 */
function deriveOverdueRisk(score: number): OverdueRisk {
  if (score <= 30) return '低';
  if (score <= 65) return '中';
  return '高';
}

/**
 * 根据风险评分生成信用建议
 */
function deriveCreditSuggestion(score: number): string {
  if (score <= 20) return '信用良好，建议授信额度10-20万';
  if (score <= 40) return '信用较好，建议授信额度5-10万';
  if (score <= 60) return '信用一般，建议授信额度2-5万，需加强贷后管理';
  if (score <= 80) return '信用偏低，建议授信额度1万以下或暂缓授信';
  return '信用极差，建议拒绝授信';
}

/**
 * 基于哈希稳定选取风险标签
 */
function deriveRiskTags(hash: number, score: number): string[] {
  // 标签数量与风险评分正相关: 低分0-1个, 高分3-5个
  const tagCount = score <= 25 ? hashRange(hash, 0, 1)
    : score <= 50 ? hashRange(hash >> 3, 1, 2)
    : score <= 75 ? hashRange(hash >> 5, 2, 3)
    : hashRange(hash >> 7, 3, 5);

  const tags: string[] = [];
  for (let i = 0; i < tagCount && i < RISK_TAG_POOL.length; i++) {
    const idx = hashRange(hash >> (i + 1), 0, RISK_TAG_POOL.length - 1);
    const tag = RISK_TAG_POOL[idx];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }
  return tags;
}

/**
 * 生成综合风险描述
 */
function deriveRiskDetail(
  name: string,
  riskLevel: RiskLevel,
  score: number,
  multiLoanIndex: number,
  courtCount: number,
  overdueRisk: OverdueRisk,
): string {
  const parts: string[] = [
    `被查询人「${name}」综合风险评分为 ${score} 分，风险等级：${riskLevel}。`,
  ];

  if (multiLoanIndex > 50) {
    parts.push(`多头借贷指数 ${multiLoanIndex}，存在多平台借贷行为。`);
  }

  if (courtCount > 0) {
    parts.push(`存在 ${courtCount} 条法院执行记录，需重点关注。`);
  }

  if (overdueRisk === '高') {
    parts.push('逾期风险较高，建议谨慎授信。');
  } else if (overdueRisk === '中') {
    parts.push('逾期风险中等，建议适当控制额度。');
  }

  return parts.join('');
}

/**
 * 基于 name + id_card 生成稳定的预置响应数据
 */
function buildPresetResponse(
  name: string,
  idCard: string,
  _phone?: string,
): Omit<RiskAssessmentResult, 'request_id'> {
  const seed = hashCode(name + idCard);

  // 风险评分: 正态偏低分布更贴近现实（多数人是低风险）
  // 通过多次哈希叠加模拟分布
  const rawScore = (
    hashRange(seed, 0, 40) +
    hashRange(seed >> 4, 0, 30) +
    hashRange(seed >> 8, 0, 30)
  );
  const risk_score = Math.min(rawScore, 100);

  const risk_level = deriveRiskLevel(risk_score);
  const multi_loan_index = hashRange(seed >> 2, 0, 100);
  const court_execution_count = risk_score > 60 ? hashRange(seed >> 6, 1, 5) : 0;
  const overdue_risk = deriveOverdueRisk(risk_score);
  const credit_suggestion = deriveCreditSuggestion(risk_score);
  const risk_tags = deriveRiskTags(seed, risk_score);
  const risk_detail = deriveRiskDetail(
    name, risk_level, risk_score, multi_loan_index, court_execution_count, overdue_risk,
  );

  const PRESET_RESPONSE = {
    name,
    id_card_masked: maskIdCard(idCard),
    risk_score,
    risk_level,
    multi_loan_index,
    court_execution_count,
    overdue_risk,
    credit_suggestion,
    risk_tags,
    risk_detail,
  };

  return PRESET_RESPONSE;
}

// ============================================================
// 主函数
// ============================================================

/**
 * 综合风险评估
 *
 * 根据姓名、身份证号（及可选手机号）进行综合风险评估，
 * 返回风险评分、风险等级、多头借贷指数、法院执行记录等维度的评估结果。
 */
async function riskAssessment(params: RiskAssessmentParams): Promise<RiskAssessmentResult> {
  const { name, id_card, phone } = params;

  if (!name || !name.trim()) {
    throw new Error('姓名不能为空');
  }

  if (!isValidIdCard(id_card)) {
    throw new Error('身份证号格式不正确');
  }

  const PRESET_RESPONSE = buildPresetResponse(name, id_card, phone);

  return {
    ...PRESET_RESPONSE,
    request_id: generateRequestId(),
  };
}

export {
  riskAssessment,
  generateRequestId,
  type RiskAssessmentParams,
  type RiskAssessmentResult,
  type RiskLevel,
  type OverdueRisk,
};
