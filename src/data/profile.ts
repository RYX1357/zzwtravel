import type { Profile } from '../types'

/**
 * ============================================
 * 张臻炜 - 个人信息
 * ============================================
 * 修改此文件即可更新首页个人信息
 * 头像图片请放置到 public/ 目录下
 */
export const profile: Profile = {
  name: '张臻炜',

  // 头像：将你的头像图片放到 public/ 目录，然后修改为对应文件名
  // 例如：'/zzwtravel/avatar.jpg'
  avatar: '',

  bio: '热爱探索未知的世界，相信每一步脚印都是生命中独特的印记。从北方的古城墙到南方的海岸线，从东部的繁华都市到西部的高原山川，用心感受每一座城市的温度与故事。',

  hometown: '浙江杭州',

  occupation: '自由职业 / 旅行爱好者',

  hobbies: ['摄影', '徒步', '品尝地道美食', '写旅行日记', '收集城市文创'],

  motto: '世界是一本书，不旅行的人只读了其中一页。',

  // 社交链接，可替换为你的真实链接
  socialLinks: [
    { label: '微博', url: 'https://weibo.com' },
    { label: '小红书', url: 'https://xiaohongshu.com' },
    { label: 'GitHub', url: 'https://github.com' },
  ],
}
