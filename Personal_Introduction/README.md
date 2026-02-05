# 个人介绍网站 - AI开发者实验室

这是一个现代化的个人介绍网站，专为AI开发者设计，展示个人技能、项目和AI工具栈。

## 功能特点

### 1. 视觉与交互
- **深色模式 + 霓虹点缀**：使用纯黑背景配以电光蓝、荧光绿等冷色调作为点缀
- **Bento Grid布局**：模仿苹果设计的便当盒布局，整洁美观
- **微交互效果**：
  - 光标跟随：鼠标移动时背景有淡色粒子跟随
  - 滚动透视：项目卡片在滚动时有轻微的3D位移感
  - 打字机效果：首页标题模拟AI生成文本的过程

### 2. 内容核心
- **AI工具栈展示**：分类展示Prompt Engineering、Development、Efficiency等工具
- **项目案例研究**：详细的项目复盘，包括痛点、解决方案和成果
- **技术深度分析**：展示对AI技术的理解和应用

### 3. 功能集成
- **AI智能助手**：网站右下角的AI助手，可回答关于个人的问题
- **PDF简历生成**：一键生成个人简历PDF
- **响应式设计**：适配各种屏幕尺寸

## 技术栈

- **前端框架**：Next.js 15+
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **类型检查**：TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
Personal_Introduction/
├── src/
│   ├── app/
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # 布局组件
│   │   └── page.tsx          # 主页组件
├── package.json              # 项目配置和依赖
├── next.config.js            # Next.js配置
├── tailwind.config.js        # Tailwind CSS配置
├── postcss.config.js         # PostCSS配置
├── tsconfig.json             # TypeScript配置
└── next-env.d.ts             # Next.js环境类型声明
```

## 自定义指南

1. **个人信息**：修改`page.tsx`中的个人介绍文本
2. **项目数据**：更新`projects`数组中的项目信息
3. **AI工具栈**：修改`AIToolStack`组件中的工具分类和项目
4. **技能展示**：更新技能卡片中的技能列表和熟练度
5. **颜色方案**：在`tailwind.config.js`中调整颜色配置

## 部署

推荐部署到Vercel或Railway，这些平台对Next.js项目有很好的支持。

### Vercel部署

1. 登录Vercel账户
2. 点击"New Project"
3. 导入GitHub仓库
4. 配置项目设置（默认即可）
5. 点击"Deploy"

### Railway部署

1. 登录Railway账户
2. 点击"New Project"
3. 选择"Deploy from GitHub repo"
4. 选择项目仓库
5. 点击"Deploy Now"

## 许可证

MIT License
