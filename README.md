# 张臻炜的旅行足迹

基于 React + Vite + ECharts 的个人旅行足迹网页，用于展示旅行地图、照片和游记。

## 功能

- **个人信息展示**：头像、简介、家乡、兴趣爱好、旅行格言
- **中国地图交互**：省份级别底图 + 城市坐标散点，已访问城市高亮
- **城市旅行详情**：点击城市查看照片、日记、标签、美食、景点、评分
- **响应式设计**：适配桌面端（三栏布局）和移动端（单栏 + 抽屉）

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite 5 | 构建工具 |
| ECharts 5 | 地图可视化 |
| GitHub Pages | 托管部署 |

### 地图数据来源

中国地图 GeoJSON 来自 **DataV.GeoAtlas**（阿里云 DataV 地理数据 API），在线加载：
`https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json`

城市坐标数据在 [src/data/cityCoordinates.ts](src/data/cityCoordinates.ts) 中维护。

## 项目结构

```
zzwtravel/
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署
├── public/
│   ├── favicon.svg
│   └── photos/                     # 旅行照片（将真实照片放这里）
├── src/
│   ├── components/
│   │   ├── Header.tsx / .css        # 顶部导航
│   │   ├── Footer.tsx / .css        # 底部信息
│   │   ├── Profile.tsx / .css       # 个人信息卡片
│   │   ├── ChinaMap.tsx / .css      # 中国地图（核心）
│   │   └── CityDetail.tsx / .css    # 城市详情面板
│   ├── data/
│   │   ├── profile.ts               # 个人信息（可编辑）
│   │   ├── travels.ts               # 旅行数据（可编辑）
│   │   └── cityCoordinates.ts       # 城市坐标数据
│   ├── types/index.ts              # TypeScript 类型定义
│   ├── App.tsx / .css              # 主布局
│   ├── main.tsx                    # 入口
│   └── index.css                   # 全局样式变量
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问
# 默认地址: http://localhost:5173/zzwtravel/
```

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录中。

## 部署到 GitHub Pages

### 方式一：GitHub Actions 自动部署（推荐）

1. 将代码推送到 GitHub 仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/zzwtravel.git
   git push -u origin main
   ```

2. 在 GitHub 仓库的 **Settings > Pages** 中：
   - Source 选择 **GitHub Actions**

3. 推送代码后，Actions 会自动构建部署。

4. 访问地址：`https://<你的用户名>.github.io/zzwtravel/`

### 方式二：手动部署

```bash
npm run build
# 将 dist/ 目录内容上传到 gh-pages 分支
```

## 如何添加旅行数据

### 添加新城市

1. 编辑 [src/data/travels.ts](src/data/travels.ts)，在 `visitedCities` 数组中添加：
   ```typescript
   {
     cityName: '南京',
     province: '江苏省',
     visitDate: '2025-03-20',
     photos: ['/zzwtravel/photos/nanjing-01.jpg'],
     diary: '在这里写旅行日记...',
     tags: ['历史文化'],
     companions: ['朋友小王'],
     foods: ['盐水鸭', '鸭血粉丝汤'],
     attractions: ['中山陵', '夫子庙'],
     rating: 4,
   }
   ```

2. 确认 [src/data/cityCoordinates.ts](src/data/cityCoordinates.ts) 中已包含该城市坐标。

### 替换照片

1. 将照片放入 `public/photos/` 目录
2. 修改 `travels.ts` 中对应城市的 `photos` 数组路径

### 修改个人信息

编辑 [src/data/profile.ts](src/data/profile.ts) 即可更新头像、简介、社交链接等。

## 部署地址生成规则

GitHub Pages 地址格式：
- **项目站点**：`https://<用户名>.github.io/<仓库名>/`
- 例如：`https://zhangzhenwei.github.io/zzwtravel/`

如果使用自定义域名，在仓库 Settings > Pages 中配置即可，同时修改 `vite.config.ts` 中的 `base` 为 `'/'`。

## License

MIT
