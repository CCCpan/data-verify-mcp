/**
 * 企业核验模块
 * Tools: verify_enterprise, query_enterprise_risk
 */

// ============ 类型定义 ============

export interface EnterpriseVerifyParams {
  enterprise_name?: string;
  credit_code?: string;
}

export interface EnterpriseVerifyResult {
  enterprise_name: string;
  legal_representative: string;
  registered_capital: number;
  establishment_date: string;
  business_status: string;
  credit_code: string;
  registered_address: string;
  business_scope: string;
  enterprise_type: string;
  industry: string;
  request_id: string;
}

export interface EnterpriseRiskParams {
  enterprise_name?: string;
  credit_code?: string;
}

export interface PenaltyRecord {
  date: string;
  reason: string;
  authority: string;
}

export interface EnterpriseRiskResult {
  risk_level: string;
  blacklist_status: string;
  penalty_count: number;
  penalty_records: PenaltyRecord[];
  abnormal_count: number;
  dishonest_count: number;
  lawsuit_count: number;
  risk_score: number;
  risk_summary: string;
  request_id: string;
}

// ============ 预设数据 ============

interface PresetEnterprise {
  keyword: string;
  enterprise_name: string;
  legal_representative: string;
  registered_capital: number;
  establishment_date: string;
  business_status: string;
  credit_code: string;
  registered_address: string;
  business_scope: string;
  enterprise_type: string;
  industry: string;
}

const PRESET_RESPONSE: PresetEnterprise[] = [
  {
    keyword: '科技',
    enterprise_name: '星云智联科技有限公司',
    legal_representative: '张明远',
    registered_capital: 5000,
    establishment_date: '2015-03-18',
    business_status: '存续',
    credit_code: '91110108MA01EXAMPLE',
    registered_address: '北京市海淀区中关村南大街12号院3号楼',
    business_scope: '技术开发、技术咨询、软件服务、信息系统集成',
    enterprise_type: '有限责任公司(自然人投资或控股)',
    industry: '信息传输、软件和信息技术服务业',
  },
  {
    keyword: '贸易',
    enterprise_name: '鸿达国际贸易有限公司',
    legal_representative: '李建国',
    registered_capital: 3000,
    establishment_date: '2012-07-22',
    business_status: '存续',
    credit_code: '91310115MA02EXAMPLE',
    registered_address: '上海市浦东新区陆家嘴东路168号',
    business_scope: '货物进出口、技术进出口、日用百货销售',
    enterprise_type: '有限责任公司(自然人投资或控股)',
    industry: '批发和零售业',
  },
  {
    keyword: '建筑',
    enterprise_name: '泰和建筑工程集团有限公司',
    legal_representative: '王志强',
    registered_capital: 10000,
    establishment_date: '2008-11-05',
    business_status: '存续',
    credit_code: '91440300MA03EXAMPLE',
    registered_address: '深圳市南山区科技园南区高新南一道8号',
    business_scope: '建筑工程施工、市政工程、装饰装修工程',
    enterprise_type: '有限责任公司(法人独资)',
    industry: '建筑业',
  },
  {
    keyword: '餐饮',
    enterprise_name: '味道轩餐饮管理有限公司',
    legal_representative: '陈小燕',
    registered_capital: 500,
    establishment_date: '2019-05-10',
    business_status: '存续',
    credit_code: '91510100MA04EXAMPLE',
    registered_address: '成都市锦江区春熙路52号',
    business_scope: '餐饮服务、食品经营、餐饮管理咨询',
    enterprise_type: '有限责任公司(自然人投资或控股)',
    industry: '住宿和餐饮业',
  },
  {
    keyword: '医药',
    enterprise_name: '康瑞生物医药科技有限公司',
    legal_representative: '刘晓华',
    registered_capital: 8000,
    establishment_date: '2010-09-15',
    business_status: '存续',
    credit_code: '91330100MA05EXAMPLE',
    registered_address: '杭州市余杭区文一西路998号',
    business_scope: '药品研发、生物技术研究、医疗器械销售',
    enterprise_type: '股份有限公司(非上市)',
    industry: '制造业',
  },
];

const DEFAULT_PRESET: PresetEnterprise = {
  keyword: '',
  enterprise_name: '中联信达实业有限公司',
  legal_representative: '赵德明',
  registered_capital: 2000,
  establishment_date: '2016-01-20',
  business_status: '存续',
  credit_code: '91110105MA06EXAMPLE',
  registered_address: '北京市朝阳区建国路88号',
  business_scope: '企业管理咨询、商务信息咨询、会议服务',
  enterprise_type: '有限责任公司(自然人投资或控股)',
  industry: '租赁和商务服务业',
};

const LEGAL_REPRESENTATIVES = [
  '张明远', '李建国', '王志强', '陈小燕', '刘晓华',
  '赵德明', '孙伟', '周丽', '吴强', '郑晓东',
];

const REGISTERED_ADDRESSES = [
  '北京市朝阳区望京东路6号', '上海市徐汇区漕溪北路398号',
  '广州市天河区天河北路233号', '深圳市福田区深南大道1003号',
  '杭州市西湖区文三路478号', '成都市高新区天府大道999号',
  '武汉市洪山区珞瑜路1037号', '南京市鼓楼区中山北路88号',
];

const PENALTY_AUTHORITIES = [
  '市场监督管理局', '税务局', '环境保护局',
  '人力资源和社会保障局', '住房和城乡建设局', '应急管理局',
];

const PENALTY_REASONS = [
  '未按规定报送年度报告', '虚假宣传', '违反税收管理规定',
  '未按规定缴纳社会保险', '产品质量不合格', '安全生产违规',
  '环境污染超标排放', '合同欺诈', '侵犯消费者权益', '不正当竞争',
];

// ============ 工具函数 ============

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

function matchPreset(input: string): PresetEnterprise {
  for (const preset of PRESET_RESPONSE) {
    if (input.includes(preset.keyword)) {
      return preset;
    }
  }
  return DEFAULT_PRESET;
}

function validateParams(params: { enterprise_name?: string; credit_code?: string }): string {
  const { enterprise_name, credit_code } = params;
  if (!enterprise_name && !credit_code) {
    throw new Error('请提供企业名称(enterprise_name)或统一社会信用代码(credit_code)');
  }
  return enterprise_name || credit_code!;
}

// ============ 核验函数 ============

export async function verifyEnterprise(params: EnterpriseVerifyParams): Promise<EnterpriseVerifyResult> {
  const input = validateParams(params);
  const hash = hashCode(input);
  const preset = matchPreset(input);

  // 基于hash生成稳定的变体数据
  const capitalVariation = preset.registered_capital + (hash % 5) * 100;
  const yearOffset = hash % 8;
  const baseYear = parseInt(preset.establishment_date.substring(0, 4), 10);
  const adjustedYear = baseYear - yearOffset + (hash % 3);
  const month = String((hash % 12) + 1).padStart(2, '0');
  const day = String((hash % 28) + 1).padStart(2, '0');

  const legalRepIndex = hash % LEGAL_REPRESENTATIVES.length;
  const addressIndex = hash % REGISTERED_ADDRESSES.length;

  // 如果传入的是企业名称，直接使用；否则使用预设
  const enterpriseName = params.enterprise_name || preset.enterprise_name;

  // 生成稳定的信用代码
  const creditCode = params.credit_code || `91${String(110100 + (hash % 300000)).substring(0, 6)}MA${String(hash).substring(0, 2)}MOCK${String(hash % 100).padStart(2, '0')}`;

  const statusOptions = ['存续', '在业', '存续'];
  const businessStatus = statusOptions[hash % statusOptions.length];

  return {
    enterprise_name: enterpriseName,
    legal_representative: LEGAL_REPRESENTATIVES[legalRepIndex],
    registered_capital: capitalVariation,
    establishment_date: `${adjustedYear}-${month}-${day}`,
    business_status: businessStatus,
    credit_code: creditCode,
    registered_address: REGISTERED_ADDRESSES[addressIndex],
    business_scope: preset.business_scope,
    enterprise_type: preset.enterprise_type,
    industry: preset.industry,
    request_id: generateRequestId(),
  };
}

export async function queryEnterpriseRisk(params: EnterpriseRiskParams): Promise<EnterpriseRiskResult> {
  const input = validateParams(params);
  const hash = hashCode(input);

  // 基于hash生成稳定的风险评分 (0-100)
  const riskScore = hash % 101;

  // 根据风险评分确定风险等级
  let riskLevel: string;
  if (riskScore <= 30) {
    riskLevel = '低';
  } else if (riskScore <= 70) {
    riskLevel = '中';
  } else {
    riskLevel = '高';
  }

  // 黑名单状态
  const blacklistStatus = riskScore > 80 ? '关注' : '正常';

  // 基于hash生成稳定的处罚/异常计数
  const penaltyCount = riskScore > 50 ? (hash % 5) : (hash % 2);
  const abnormalCount = riskScore > 60 ? (hash % 3) : 0;
  const dishonestCount = riskScore > 75 ? (hash % 2) : 0;
  const lawsuitCount = riskScore > 40 ? (hash % 8) : (hash % 2);

  // 生成处罚记录（最多2条）
  const penaltyRecords: PenaltyRecord[] = [];
  const recordCount = Math.min(penaltyCount, 2);
  for (let i = 0; i < recordCount; i++) {
    const recordHash = hashCode(input + String(i));
    const year = 2020 + (recordHash % 5);
    const month = String((recordHash % 12) + 1).padStart(2, '0');
    const day = String((recordHash % 28) + 1).padStart(2, '0');
    penaltyRecords.push({
      date: `${year}-${month}-${day}`,
      reason: PENALTY_REASONS[recordHash % PENALTY_REASONS.length],
      authority: PENALTY_AUTHORITIES[recordHash % PENALTY_AUTHORITIES.length],
    });
  }

  // 生成风险摘要
  const enterpriseName = params.enterprise_name || '该企业';
  let riskSummary: string;
  if (riskScore <= 30) {
    riskSummary = `${enterpriseName}经营状况良好，无明显风险信号，信用记录正常。`;
  } else if (riskScore <= 70) {
    riskSummary = `${enterpriseName}存在一定经营风险，有${penaltyCount}次行政处罚记录、${lawsuitCount}次涉诉记录，建议关注后续动态。`;
  } else {
    riskSummary = `${enterpriseName}风险较高，存在${penaltyCount}次行政处罚、${dishonestCount}次失信记录、${abnormalCount}次经营异常，建议谨慎合作。`;
  }

  return {
    risk_level: riskLevel,
    blacklist_status: blacklistStatus,
    penalty_count: penaltyCount,
    penalty_records: penaltyRecords,
    abnormal_count: abnormalCount,
    dishonest_count: dishonestCount,
    lawsuit_count: lawsuitCount,
    risk_score: riskScore,
    risk_summary: riskSummary,
    request_id: generateRequestId(),
  };
}
