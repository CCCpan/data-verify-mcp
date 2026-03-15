/**
 * 交通物流核验模块
 * Tools: query_vehicle_info, vehicle_risk_score
 */

// ============ 类型定义 ============

export interface VehicleInfoParams {
  plate_number: string;
  plate_color?: string;
}

export interface VehicleInfoResult {
  plate_number: string;
  plate_color: string;
  vehicle_type: string;
  brand: string;
  engine_no: string;
  vin: string;
  register_date: string;
  use_type: string;
  fuel_type: string;
  vehicle_status: string;
  mileage_estimate: number;
  request_id: string;
}

export interface VehicleRiskParams {
  plate_number: string;
  plate_color?: string;
}

export interface VehicleRiskResult {
  plate_number: string;
  risk_score: number;
  risk_level: string;
  speeding_count: number;
  fatigue_count: number;
  night_driving_ratio: number;
  accident_count: number;
  violation_count: number;
  insurance_status: string;
  risk_details: string;
  request_id: string;
}

// ============ 预设数据 ============

const PLATE_REGEX = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/;

const VEHICLE_TYPES = ['小型汽车', '大型汽车', '小型新能源汽车', '大型新能源汽车'];

const VEHICLE_BRANDS = [
  '丰田卡罗拉', '本田思域', '大众朗逸', '日产轩逸', '别克英朗',
  '吉利帝豪', '长安逸动', '比亚迪秦', '哈弗H6', '奇瑞艾瑞泽',
  '五菱宏光', '宝骏510', '荣威i5', '传祺GS4', '长城炮',
  '红旗H5', '蔚来ES6', '小鹏P7', '理想L7', '零跑C11',
];

const FUEL_TYPES = ['汽油', '柴油', '纯电', '混动'];

const USE_TYPES = ['非营运', '营运', '出租', '租赁'];

const VEHICLE_STATUSES = ['正常', '注销', '转出', '查封'];

const PLATE_COLORS = ['蓝色', '黄色', '绿色', '白色', '黑色'];

const RISK_LEVELS: { max: number; level: string }[] = [
  { max: 25, level: '低' },
  { max: 50, level: '中' },
  { max: 75, level: '高' },
  { max: 100, level: '极高' },
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

function getRiskLevel(score: number): string {
  for (const item of RISK_LEVELS) {
    if (score <= item.max) return item.level;
  }
  return '极高';
}

function generateRiskDetails(params: {
  riskLevel: string;
  speedingCount: number;
  fatigueCount: number;
  accidentCount: number;
  violationCount: number;
  insuranceStatus: string;
}): string {
  const parts: string[] = [];
  parts.push(`该车辆风险等级为${params.riskLevel}`);

  if (params.speedingCount > 0) {
    parts.push(`累计超速${params.speedingCount}次`);
  }
  if (params.fatigueCount > 0) {
    parts.push(`疲劳驾驶${params.fatigueCount}次`);
  }
  if (params.accidentCount > 0) {
    parts.push(`发生事故${params.accidentCount}次`);
  }
  if (params.violationCount > 0) {
    parts.push(`违章记录${params.violationCount}次`);
  }
  if (params.insuranceStatus === '过期') {
    parts.push('保险已过期，请及时续保');
  }

  return parts.join('，') + '。';
}

// ============ 核验函数 ============

export async function queryVehicleInfo(params: VehicleInfoParams): Promise<VehicleInfoResult> {
  const { plate_number, plate_color = '蓝色' } = params;

  if (!PLATE_REGEX.test(plate_number)) {
    throw new Error('车牌号格式不正确，请输入有效车牌号（如京A12345）');
  }

  if (!PLATE_COLORS.includes(plate_color)) {
    throw new Error(`车牌颜色不正确，支持的颜色：${PLATE_COLORS.join('、')}`);
  }

  const hash = hashCode(plate_number);

  const vehicleType = VEHICLE_TYPES[hash % VEHICLE_TYPES.length];
  const brand = VEHICLE_BRANDS[hash % VEHICLE_BRANDS.length];
  const fuelType = FUEL_TYPES[hash % FUEL_TYPES.length];
  const useType = USE_TYPES[hash % USE_TYPES.length];
  const vehicleStatus = hash % 100 < 90 ? '正常' : VEHICLE_STATUSES[hash % VEHICLE_STATUSES.length];

  const engineNo = String(hash % 1000000).padStart(6, '0');
  const vinHash = hashCode(plate_number + 'vin');
  const vin = String(vinHash % 1000000).padStart(6, '0');

  const baseYear = 2005 + (hash % 18);
  const month = String(1 + (hash % 12)).padStart(2, '0');
  const day = String(1 + (hash % 28)).padStart(2, '0');
  const registerDate = `${baseYear}-${month}-${day}`;

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - baseYear;
  const mileageEstimate = Math.round(vehicleAge * (8000 + (hash % 12000)));

  const PRESET_RESPONSE: VehicleInfoResult = {
    plate_number,
    plate_color,
    vehicle_type: vehicleType,
    brand,
    engine_no: engineNo,
    vin,
    register_date: registerDate,
    use_type: useType,
    fuel_type: fuelType,
    vehicle_status: vehicleStatus,
    mileage_estimate: mileageEstimate,
    request_id: generateRequestId(),
  };

  return PRESET_RESPONSE;
}

export async function vehicleRiskScore(params: VehicleRiskParams): Promise<VehicleRiskResult> {
  const { plate_number, plate_color = '蓝色' } = params;

  if (!PLATE_REGEX.test(plate_number)) {
    throw new Error('车牌号格式不正确，请输入有效车牌号（如京A12345）');
  }

  if (!PLATE_COLORS.includes(plate_color)) {
    throw new Error(`车牌颜色不正确，支持的颜色：${PLATE_COLORS.join('、')}`);
  }

  const hash = hashCode(plate_number);
  const hash2 = hashCode(plate_number + 'risk');

  const riskScore = hash % 101;
  const riskLevel = getRiskLevel(riskScore);
  const speedingCount = hash % 15;
  const fatigueCount = hash2 % 8;
  const nightDrivingRatio = Math.round((hash % 60) + (hash2 % 20));
  const accidentCount = hash % 5;
  const violationCount = hash2 % 20;
  const insuranceStatus = hash % 100 < 85 ? '正常' : '过期';

  const riskDetails = generateRiskDetails({
    riskLevel,
    speedingCount,
    fatigueCount: fatigueCount,
    accidentCount,
    violationCount,
    insuranceStatus,
  });

  const PRESET_RESPONSE: VehicleRiskResult = {
    plate_number,
    risk_score: riskScore,
    risk_level: riskLevel,
    speeding_count: speedingCount,
    fatigue_count: fatigueCount,
    night_driving_ratio: nightDrivingRatio,
    accident_count: accidentCount,
    violation_count: violationCount,
    insurance_status: insuranceStatus,
    risk_details: riskDetails,
    request_id: generateRequestId(),
  };

  return PRESET_RESPONSE;
}
