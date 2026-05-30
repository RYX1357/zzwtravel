/** 旅行标签 */
export type TravelTag =
  | '美食'
  | '自然风光'
  | '历史文化'
  | '城市漫步'
  | '博物馆'
  | '古镇'
  | '海滩'
  | '登山'
  | '自驾'
  | '摄影'
  | '美食探店'
  | '艺术展'
  | '寺庙'
  | '园林'
  | '夜市'

/** 城市旅行数据 */
export interface CityTravel {
  /** 城市名称 */
  cityName: string
  /** 所属省份 */
  province: string
  /** 旅行日期，格式 YYYY-MM-DD */
  visitDate: string
  /** 旅行照片列表，路径相对于 public/photos/ */
  photos: string[]
  /** 旅行日记正文 */
  diary: string
  /** 旅行标签 */
  tags: TravelTag[]
  /** 同行人 */
  companions?: string[]
  /** 推荐美食 */
  foods?: string[]
  /** 推荐景点 */
  attractions?: string[]
  /** 个人评分 1-5 */
  rating?: number
}

/** 个人信息 */
export interface Profile {
  /** 姓名 */
  name: string
  /** 头像路径，相对于 public/ */
  avatar: string
  /** 个人简介 */
  bio: string
  /** 家乡 */
  hometown: string
  /** 职业/身份 */
  occupation: string
  /** 兴趣爱好 */
  hobbies: string[]
  /** 旅行格言 */
  motto: string
  /** 联系方式或社交链接 */
  socialLinks: {
    label: string
    url: string
  }[]
}

/** 地图城市坐标 */
export interface CityCoordinate {
  name: string
  coordinates: [number, number]
  province: string
}
