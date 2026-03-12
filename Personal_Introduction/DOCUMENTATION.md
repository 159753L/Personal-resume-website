# 个人介绍网站 - 完整文档

## 1. 项目概述

这是一个现代化的个人介绍网站，专为AI开发者设计，展示个人技能、项目经验和AI工具栈。网站采用了深色主题配合霓虹效果，结合了多种现代前端技术和交互设计理念，打造出具有科技感和未来感的用户体验。

### 1.1 设计理念

- **科技感与未来感**：使用深色主题搭配霓虹色调，营造出AI实验室的氛围
- **极简主义**：以内容为中心，去除不必要的装饰元素
- **动态交互**：通过微交互和动画效果提升用户体验
- **响应式设计**：确保在各种设备上都能提供良好的浏览体验

## 2. 功能特性

### 2.1 视觉效果

#### 2.1.1 颜色方案
- **主色调**：黑色背景 (#000000) 配合电光蓝 (#00FFFF) 作为强调色
- **辅助色**：荧光绿 (#39FF14)、紫色 (#8A2BE2) 用于特定元素和交互
- **文本色**：白色文本 (#FFFFFF) 搭配不同透明度的灰色变体

#### 2.1.2 布局设计
- **Bento Grid布局**：采用类似苹果设计的便当盒布局，将内容划分为整齐的卡片
- **分层设计**：通过z-index和阴影效果创建视觉层次感
- **留白艺术**：合理使用留白增强内容可读性

#### 2.1.3 动画与交互
- **粒子背景效果**：页面背景有随机出现和消失的粒子效果
- **光标跟随**：鼠标移动时，有淡色粒子跟随光标
- **打字机效果**：首页标题采用打字机效果，模拟AI生成文本的过程
- **滚动动画**：元素在进入视口时有渐入效果
- **悬停效果**：按钮和卡片在悬停时有缩放和颜色变化

### 2.2 核心功能

#### 2.2.1 个人信息展示
- 个人简介和头像
- 联系方式和社交媒体链接
- 专业技能和技术栈

#### 2.2.2 AI工具栈展示
- 分类展示不同领域的AI工具
- 支持编辑和自定义工具列表
- 可视化工具分类展示

#### 2.2.3 项目展示
- 项目卡片网格布局
- 项目详情展示（标题、描述、技术栈）
- 项目悬停效果和交互

#### 2.2.4 简历生成
- 一键生成个人简历PDF
- 支持自定义简历内容

## 3. 技术架构

### 3.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15+ | 前端框架 |
| React | 18.2.0 | UI库 |
| TypeScript | 4.9+ | 类型检查 |
| Tailwind CSS | 3.3.3 | 样式框架 |
| Framer Motion | 12.33.0 | 动画库 |
| jsPDF | 4.1.0 | PDF生成 |
| jsPDF-AutoTable | 5.0.7 | PDF表格生成 |

### 3.2 项目结构

```
Personal_Introduction/
├── public/                 # 静态资源目录
│   └── profile_photo.jpg  # 个人头像
├── src/                    # 源代码目录
│   └── app/                # Next.js 15+ App Router
│       ├── admin/          # 管理页面
│       │   └── page.tsx    # 管理页面组件
│       ├── globals.css     # 全局样式文件
│       ├── layout.tsx      # 根布局组件
│       └── page.tsx        # 主页面组件
├── .gitignore              # Git忽略文件
├── README.md               # 项目说明文档
├── DOCUMENTATION.md        # 完整文档（本文件）
├── next.config.js          # Next.js配置
├── package.json            # 项目依赖和脚本
├── postcss.config.js       # PostCSS配置
├── tailwind.config.js      # Tailwind CSS配置
└── tsconfig.json           # TypeScript配置
```

### 3.3 关键组件分析

#### 3.3.1 粒子效果组件 (ClientParticles)
- 动态生成50个随机大小、透明度的粒子
- 使用Framer Motion实现粒子的淡入淡出和缩放动画
- 仅在客户端渲染，避免服务器端渲染问题

#### 3.3.2 光标跟随组件 (CursorFollower)
- 监听鼠标移动事件，实时更新跟随元素位置
- 使用CSS transform实现平滑跟随效果
- 增强页面的交互感和趣味性

#### 3.3.3 打字机效果组件 (TypewriterEffect)
- 逐字符显示文本，模拟打字机效果
- 支持自定义文本内容和打字速度
- 包含闪烁的光标动画

#### 3.3.4 项目卡片组件 (ProjectCard)
- 展示项目标题、描述和技术栈
- 悬停时有上浮效果
- 响应式设计，适配不同屏幕尺寸

#### 3.3.5 可编辑AI工具栈组件 (EditableAIToolStack)
- 支持添加/删除工具分类
- 支持添加/删除工具项
- 实时编辑和保存功能
- 动态更新UI展示

## 4. 安装与配置

### 4.1 环境要求

- Node.js 18+ 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 4.2 安装步骤

1. **克隆或下载项目**

   ```bash
   # 如果使用Git克隆
   git clone <repository-url>
   cd Personal_Introduction
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置环境变量**

   如果需要配置环境变量，可以在项目根目录创建 `.env` 文件：

   ```bash
   # .env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 4.3 开发模式运行

```bash
npm run dev
```

启动后，访问 http://localhost:3000 查看网站

### 4.4 构建生产版本

```bash
npm run build
```

### 4.5 生产模式运行

```bash
npm start
```

## 5. 开发指南

### 5.1 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint代码规范
- 组件命名采用PascalCase
- 变量和函数命名采用camelCase
- 使用Tailwind CSS进行样式开发

### 5.2 组件开发

#### 5.2.1 创建新组件

```typescript
// src/components/MyComponent.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <motion.div
      className="my-component"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{title}</h2>
      {/* 组件内容 */}
    </motion.div>
  );
};

export default MyComponent;
```

#### 5.2.2 添加动画效果

使用Framer Motion添加动画效果：

```typescript
<motion.div
  className="animated-element"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
>
  {/* 元素内容 */}
</motion.div>
```

### 5.3 样式开发

使用Tailwind CSS进行样式开发：

```typescript
<div className="bg-background text-text p-6 rounded-lg shadow-lg">
  <h3 className="text-xl font-bold text-primary mb-2">标题</h3>
  <p className="text-muted">内容文本</p>
</div>
```

### 5.4 调试技巧

- 使用浏览器开发者工具查看和调试CSS样式
- 使用Next.js的开发服务器热重载功能快速预览更改
- 使用TypeScript的类型检查功能捕获潜在错误
- 使用console.log()或debugger语句调试JavaScript代码

## 6. 定制指南

### 6.1 修改个人信息

编辑 `src/app/page.tsx` 文件中的个人信息：

```typescript
// 修改个人简介
const personalInfo = {
  name: "您的姓名",
  title: "AI开发者",
  bio: "您的个人简介...",
  // 其他信息
};
```

### 6.2 更新头像

将新头像图片命名为 `profile_photo.jpg` 并替换 `public/` 目录下的现有文件。

### 6.3 修改项目数据

编辑 `src/app/page.tsx` 文件中的项目数组：

```typescript
const projects = [
  {
    title: "项目名称",
    description: "项目描述...",
    tech: ["React", "Next.js", "TypeScript"],
    image: "/project-image.jpg"
  },
  // 其他项目
];
```

### 6.4 自定义AI工具栈

在网站管理页面（/admin）可以直接编辑AI工具栈，或者手动修改 `src/app/page.tsx` 中的工具数据：

```typescript
const aiTools = [
  {
    category: "Prompt Engineering",
    items: ["ChatGPT", "Claude", "Bard"]
  },
  // 其他分类
];
```

### 6.5 修改颜色方案

编辑 `tailwind.config.js` 文件中的颜色配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#00FFFF",      // 主色调
        secondary: "#39FF14",    // 辅助色
        background: "#000000",   // 背景色
        text: "#FFFFFF",         // 文本色
        muted: "#CCCCCC",        // 次要文本色
        // 其他颜色
      },
    },
  },
};
```

## 7. 部署指南

### 7.1 Vercel部署

1. 登录Vercel账户
2. 点击"New Project"
3. 导入GitHub仓库
4. 配置项目设置（默认即可）
5. 点击"Deploy"

### 7.2 Netlify部署

1. 登录Netlify账户
2. 点击"Add new site" → "Import an existing project"
3. 连接GitHub仓库
4. 配置构建命令：`npm run build`
5. 配置发布目录：`.next`
6. 点击"Deploy site"

### 7.3 自定义服务器部署

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 运行生产服务器
npm start
```

建议使用PM2或类似工具管理生产服务器：

```bash
# 全局安装PM2
npm install -g pm2

# 使用PM2启动应用
pm run build
pm run pm2:start
```

## 8. 维护与更新

### 8.1 更新依赖

```bash
# 检查可更新的依赖
npm outdated

# 更新所有依赖
npm update

# 或使用npm-check-updates工具
npx npm-check-updates -u
npm install
```

### 8.2 备份数据

定期备份项目数据和配置文件，特别是：
- 个人信息和项目数据
- 自定义配置
- 静态资源文件

### 8.3 性能优化

- 压缩图片资源
- 使用代码分割减少初始加载时间
- 优化动画效果，避免过度使用导致性能问题
- 定期清理无用代码和依赖

## 9. 故障排除

### 9.1 常见问题

#### 9.1.1 安装依赖失败

```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install
```

#### 9.1.2 开发服务器启动失败

- 检查端口是否被占用
- 确保Node.js版本符合要求
- 查看错误日志，根据提示进行修复

#### 9.1.3 样式显示异常

- 检查Tailwind CSS配置是否正确
- 确保已正确导入全局样式文件
- 检查类名拼写是否正确

#### 9.1.4 动画效果不工作

- 确保已正确导入Framer Motion
- 检查动画配置是否正确
- 确保组件使用了'use client'指令（如果需要客户端渲染）

## 10. 未来规划

### 10.1 功能扩展

- [ ] 添加博客功能
- [ ] 集成作品集展示
- [ ] 添加在线联系表单
- [ ] 实现多语言支持
- [ ] 添加暗黑/明亮模式切换

### 10.2 性能优化

- [ ] 实现图片懒加载
- [ ] 添加骨架屏效果
- [ ] 优化首屏加载时间
- [ ] 实现离线支持

### 10.3 用户体验改进

- [ ] 添加键盘导航支持
- [ ] 优化屏幕阅读器支持
- [ ] 添加更多微交互效果
- [ ] 改进移动端体验

## 11. 许可证

本项目采用MIT许可证。详情请见LICENSE文件。

## 12. 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：your-email@example.com
- 网站：your-website.com
- GitHub：github.com/your-username

---

**文档更新时间**：2026年3月7日
**文档版本**：1.0.0