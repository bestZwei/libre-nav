# 🚀 快速开始指南

## 📋 前置要求

- Node.js 18+ 
- npm 或 pnpm
- Git

## ⚡ 5分钟快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local (可选,默认密码是 admin123)
# ADMIN_PASSWORD=your_secure_password
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问网站

- **前台**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin
- **默认密码**: admin123

## 🎯 核心功能测试

### ✅ 测试前台功能

1. **浏览导航**
   - 访问首页,查看导航卡片
   - 点击左侧边栏切换分类

2. **搜索功能**
   - 按 `Ctrl/Cmd + K` 打开搜索
   - 输入 "github" 测试搜索
   - 输入 "daima" 测试拼音搜索

3. **收藏功能**
   - 鼠标悬停在卡片上
   - 点击星标图标收藏
   - 刷新页面验证收藏保存

4. **主题切换**
   - 点击顶部月亮/太阳图标
   - 切换暗色/亮色主题

5. **跳转功能**
   - 点击任意网站卡片
   - 查看跳转页倒计时

### ✅ 测试后台功能

1. **登录**
   - 访问 http://localhost:3000/admin
   - 输入密码: admin123
   - 点击登录

2. **数据查看**
   - 目前有登录页面
   - API 路由已完成 (/api/auth, /api/links, /api/categories)

## 📦 构建和部署

### 构建生产版本

```bash
npm run build
npm start
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 添加环境变量
vercel env add ADMIN_PASSWORD
```

### 部署到 Cloudflare Pages

1. 推送代码到 GitHub
2. 在 Cloudflare Pages 连接仓库
3. 构建设置:
   - Build command: `npm run build`
   - Build output: `.next`
4. 添加环境变量: `ADMIN_PASSWORD`

## 🔧 常用命令

```bash
# 开发
npm run dev         # 启动开发服务器
npm run build       # 构建生产版本
npm start           # 启动生产服务器
npm run lint        # 代码检查

# shadcn/ui
npx shadcn@latest add [component]  # 添加新组件
```

## 📝 修改数据

### 方式1: 直接编辑 JSON

编辑 `public/data/navigation.json`:

```json
{
  "links": [
    {
      "id": "link-001",
      "title": "新网站",
      "url": "https://example.com",
      "description": "网站描述",
      "categoryId": "cat-001",
      "tags": ["标签1", "标签2"],
      "visible": true,
      "order": 1
    }
  ]
}
```

### 方式2: 通过 API

```bash
# 获取所有链接
curl http://localhost:3000/api/links

# 添加新链接 (需要先登录)
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新网站",
    "url": "https://example.com",
    "description": "网站描述",
    "categoryId": "cat-001",
    "tags": ["标签"],
    "visible": true,
    "order": 1
  }'
```

## 🎨 自定义样式

### 修改主题颜色

编辑 `src/app/globals.css`:

```css
@layer base {
  :root {
    --primary: 221.2 83.2% 53.3%; /* 修改这里 */
  }
}
```

### 修改布局

编辑 `public/data/navigation.json`:

```json
{
  "settings": {
    "layout": {
      "columns": {
        "mobile": 1,    // 手机端列数
        "tablet": 2,    // 平板端列数
        "desktop": 4    // 桌面端列数
      }
    }
  }
}
```

## ❓ 常见问题

### Q: 如何修改管理员密码?

A: 编辑 `.env.local` 文件:
```bash
ADMIN_PASSWORD=your_new_password
```

### Q: 数据保存在哪里?

A: 所有数据保存在 `public/data/navigation.json` 文件中。

### Q: 如何添加新的分类?

A: 编辑 `navigation.json` 文件,在 `categories` 数组中添加:
```json
{
  "id": "cat-006",
  "name": "新分类",
  "icon": "Folder",
  "description": "分类描述",
  "order": 6,
  "visible": true
}
```

### Q: 图标从哪里来?

A: 使用 Lucide Icons。查看可用图标: https://lucide.dev/icons/

### Q: 如何禁用跳转页?

A: 编辑 `navigation.json`:
```json
{
  "settings": {
    "goto": {
      "enabled": false
    }
  }
}
```

## 🆘 获取帮助

1. 查看 [README.md](./README.md) 完整文档
2. 查看 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) 项目总结
3. 查看代码注释
4. 提交 Issue

## ✨ 下一步

- 浏览 `src/components` 了解组件结构
- 阅读 `src/lib` 了解工具函数
- 查看 `src/hooks` 了解自定义 Hooks
- 尝试修改数据和样式

---

祝你使用愉快! 🎉
