import type { CityCoordinate } from '../types'

/**
 * ============================================
 * 中国城市坐标数据
 * ============================================
 * 用于在地图上定位城市标记点
 * 坐标格式：[经度, 纬度]
 *
 * 【如何添加新城市坐标】
 * 在 ALL_CITY_COORDINATES 数组中添加新条目，
 * 确保 name 与 travels.ts 中的 cityName 一致。
 *
 * 数据来源：公开地理坐标数据
 */
export const ALL_CITY_COORDINATES: CityCoordinate[] = [
  // ===== 直辖市 =====
  { name: '北京', coordinates: [116.46, 39.92], province: '北京市' },
  { name: '上海', coordinates: [121.48, 31.22], province: '上海市' },
  { name: '天津', coordinates: [117.20, 39.13], province: '天津市' },
  { name: '重庆', coordinates: [106.55, 29.57], province: '重庆市' },

  // ===== 河北省 =====
  { name: '石家庄', coordinates: [114.51, 38.04], province: '河北省' },

  // ===== 山西省 =====
  { name: '太原', coordinates: [112.55, 37.87], province: '山西省' },

  // ===== 内蒙古 =====
  { name: '呼和浩特', coordinates: [111.75, 40.84], province: '内蒙古自治区' },

  // ===== 辽宁省 =====
  { name: '沈阳', coordinates: [123.43, 41.80], province: '辽宁省' },
  { name: '大连', coordinates: [121.62, 38.92], province: '辽宁省' },

  // ===== 吉林省 =====
  { name: '长春', coordinates: [125.32, 43.90], province: '吉林省' },

  // ===== 黑龙江省 =====
  { name: '哈尔滨', coordinates: [126.53, 45.80], province: '黑龙江省' },

  // ===== 江苏省 =====
  { name: '南京', coordinates: [118.79, 32.06], province: '江苏省' },
  { name: '苏州', coordinates: [120.59, 31.30], province: '江苏省' },
  { name: '无锡', coordinates: [120.31, 31.49], province: '江苏省' },

  // ===== 浙江省 =====
  { name: '杭州', coordinates: [120.19, 30.26], province: '浙江省' },
  { name: '宁波', coordinates: [121.54, 29.87], province: '浙江省' },
  { name: '温州', coordinates: [120.70, 28.00], province: '浙江省' },

  // ===== 安徽省 =====
  { name: '合肥', coordinates: [117.23, 31.82], province: '安徽省' },
  { name: '黄山', coordinates: [118.33, 29.71], province: '安徽省' },

  // ===== 福建省 =====
  { name: '福州', coordinates: [119.30, 26.07], province: '福建省' },
  { name: '厦门', coordinates: [118.09, 24.48], province: '福建省' },

  // ===== 江西省 =====
  { name: '南昌', coordinates: [115.86, 28.68], province: '江西省' },

  // ===== 山东省 =====
  { name: '济南', coordinates: [117.00, 36.67], province: '山东省' },
  { name: '青岛', coordinates: [120.38, 36.07], province: '山东省' },

  // ===== 河南省 =====
  { name: '郑州', coordinates: [113.62, 34.75], province: '河南省' },
  { name: '洛阳', coordinates: [112.45, 34.62], province: '河南省' },

  // ===== 湖北省 =====
  { name: '武汉', coordinates: [114.30, 30.60], province: '湖北省' },

  // ===== 湖南省 =====
  { name: '长沙', coordinates: [112.94, 28.23], province: '湖南省' },
  { name: '张家界', coordinates: [110.48, 29.13], province: '湖南省' },

  // ===== 广东省 =====
  { name: '广州', coordinates: [113.26, 23.13], province: '广东省' },
  { name: '深圳', coordinates: [114.06, 22.54], province: '广东省' },
  { name: '珠海', coordinates: [113.58, 22.27], province: '广东省' },

  // ===== 广西 =====
  { name: '南宁', coordinates: [108.32, 22.82], province: '广西壮族自治区' },
  { name: '桂林', coordinates: [110.28, 25.27], province: '广西壮族自治区' },

  // ===== 海南省 =====
  { name: '海口', coordinates: [110.33, 20.03], province: '海南省' },
  { name: '三亚', coordinates: [109.51, 18.25], province: '海南省' },

  // ===== 四川省 =====
  { name: '成都', coordinates: [104.07, 30.67], province: '四川省' },

  // ===== 贵州省 =====
  { name: '贵阳', coordinates: [106.71, 26.65], province: '贵州省' },

  // ===== 云南省 =====
  { name: '昆明', coordinates: [102.71, 25.04], province: '云南省' },
  { name: '大理', coordinates: [100.23, 25.61], province: '云南省' },
  { name: '丽江', coordinates: [100.23, 26.86], province: '云南省' },

  // ===== 西藏 =====
  { name: '拉萨', coordinates: [91.17, 29.65], province: '西藏自治区' },

  // ===== 陕西省 =====
  { name: '西安', coordinates: [108.94, 34.26], province: '陕西省' },

  // ===== 甘肃省 =====
  { name: '兰州', coordinates: [103.83, 36.06], province: '甘肃省' },

  // ===== 青海省 =====
  { name: '西宁', coordinates: [101.78, 36.62], province: '青海省' },

  // ===== 宁夏 =====
  { name: '银川', coordinates: [106.27, 38.47], province: '宁夏回族自治区' },

  // ===== 新疆 =====
  { name: '乌鲁木齐', coordinates: [87.62, 43.82], province: '新疆维吾尔自治区' },

  // ===== 台湾省 =====
  { name: '台北', coordinates: [121.52, 25.03], province: '台湾省' },

  // ===== 香港/澳门 =====
  { name: '香港', coordinates: [114.17, 22.28], province: '香港特别行政区' },
  { name: '澳门', coordinates: [113.55, 22.19], province: '澳门特别行政区' },
]

/**
 * 获取已访问城市的坐标集合
 * 用于快速判断某个城市是否已访问
 */
export function getVisitedCityNames(visitedCities: { cityName: string }[]): Set<string> {
  return new Set(visitedCities.map((c) => c.cityName))
}
