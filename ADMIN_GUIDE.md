# 管理后台功能文档

## 📚 目录
- [功能概述](#功能概述)
- [访问方式](#访问方式)
- [功能详解](#功能详解)
- [API接口](#api接口)
- [数据结构](#数据结构)

---

## 功能概述

管理后台提供了完整的导航网站内容管理功能，包括：

✅ **链接管理** - 添加、编辑、删除导航链接
✅ **分类管理** - 管理导航分类
✅ **数据导入导出** - 备份和恢复数据
✅ **实时预览** - 操作后立即在前台生效
✅ **批量操作** - 快速显示/隐藏链接和分类

---

## 访问方式

### 1. 访问登录页面
```
http://localhost:3000/admin
```

### 2. 登录凭据
- **默认密码**: `admin123`
- 可通过修改 `.env.local` 文件更改密码：
  ```env
  ADMIN_PASSWORD=your_secure_password
  ```

### 3. 会话管理
- 登录后会话保持 **7天**
- Cookie 方式存储，安全可靠
- 支持退出登录

---

## 功能详解

### 📊 数据统计
进入后台首页即可看到：
- **总链接数** - 所有链接数量
- **显示链接** - 前台可见的链接数
- **分类数量** - 分类总数
- **推荐链接** - 设为推荐的链接数

### 🔗 链接管理

#### 添加链接
1. 点击 **"添加链接"** 按钮
2. 填写表单：
   - **标题*** - 链接名称（必填）
   - **URL*** - 链接地址（必填）
   - **描述** - 简短介绍（选填）
   - **Logo URL** - 网站图标地址（选填）
   - **分类*** - 选择所属分类（必填）
   - **标签** - 用逗号分隔（选填）
   - **排序** - 数字越小越靠前（默认0）
   - **显示** - 是否在前台显示
   - **推荐** - 是否标记为推荐

#### 编辑链接
1. 点击链接行的 **编辑图标** ✏️
2. 修改需要更新的字段
3. 点击 **"保存"** 完成修改

#### 删除链接
1. 点击链接行的 **删除图标** 🗑️
2. 确认删除操作
3. 链接将被永久删除

#### 快速操作
- **显示/隐藏** - 点击 👁️ 图标快速切换显示状态
- **搜索** - 使用搜索框快速查找链接
- **查看详情** - 点击链接可在新标签页打开

### 📁 分类管理

#### 添加分类
1. 切换到 **"分类管理"** 标签
2. 点击 **"添加分类"** 按钮
3. 填写表单：
   - **名称*** - 分类名称（必填）
   - **图标*** - 选择 Lucide 图标（必填）
   - **描述** - 分类说明（选填）
   - **排序** - 显示顺序（默认0）
   - **显示** - 是否在侧边栏显示

#### 编辑分类
1. 点击分类行的 **编辑图标** ✏️
2. 修改分类信息
3. 点击 **"保存"** 保存修改

#### 删除分类
- ⚠️ **注意**: 只能删除没有链接的分类
- 如果分类下有链接，需要先删除或移动链接
- 系统会提示无法删除的原因

#### 图标选择
系统提供30+常用图标：
```
Folder, FolderTree, Globe, Star, Bookmark, Tag, Archive,
Box, Briefcase, Code, Database, FileText, Layers, Package,
Server, Shield, Tool, Zap, Heart, Home, Image, Link,
Music, Video, Camera, Film, Book, Palette, Cpu, Cloud...
```

### 💾 数据导入导出

#### 导出数据
1. 点击顶部 **"导出数据"** 按钮
2. 自动下载 JSON 文件：`navigation-backup-{timestamp}.json`
3. 文件包含所有链接和分类数据

#### 导入数据
1. 点击顶部 **"导入数据"** 按钮
2. 选择之前导出的 JSON 文件
3. 系统验证数据格式
4. 确认导入（会替换现有数据）
5. 导入成功后自动刷新

#### 数据格式
```json
{
  "links": [
    {
      "id": "link-xxx",
      "title": "示例链接",
      "url": "https://example.com",
      "description": "描述",
      "logo": "https://example.com/logo.png",
      "categoryId": "cat-xxx",
      "tags": ["标签1", "标签2"],
      "featured": false,
      "order": 0,
      "visible": true,
      "createdAt": "2024-12-26T10:00:00.000Z",
      "updatedAt": "2024-12-26T10:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": "cat-xxx",
      "name": "分类名",
      "icon": "Folder",
      "description": "描述",
      "order": 0,
      "visible": true
    }
  ]
}
```

---

## API接口

### 认证相关

#### POST `/api/auth`
登录/登出
```typescript
// 登录
{
  "password": "admin123"
}

// 登出
{
  "action": "logout"
}
```

#### GET `/api/auth/check`
检查登录状态
```typescript
Response: {
  "success": true,
  "authenticated": true
}
```

### 链接管理

#### GET `/api/links`
获取所有链接
```typescript
Response: {
  "success": true,
  "data": NavLink[]
}
```

#### POST `/api/links`
添加链接（需认证）
```typescript
Request: {
  "title": "string",
  "url": "string",
  "categoryId": "string",
  "description": "string",
  "logo": "string",
  "tags": ["string"],
  "visible": boolean,
  "featured": boolean,
  "order": number
}
```

#### PUT `/api/links`
更新链接（需认证）
```typescript
Request: {
  "id": "string",
  ...updates
}
```

#### DELETE `/api/links?id={linkId}`
删除链接（需认证）

### 分类管理

#### GET `/api/categories`
获取所有分类

#### POST `/api/categories`
添加分类（需认证）
```typescript
Request: {
  "name": "string",
  "icon": "string",
  "description": "string",
  "order": number,
  "visible": boolean
}
```

#### PUT `/api/categories`
更新分类（需认证）

#### DELETE `/api/categories?id={categoryId}`
删除分类（需认证）

### 数据管理

#### GET `/api/admin/data`
导出全部数据（需认证）

#### POST `/api/admin/data`
导入数据（需认证）
```typescript
Request: {
  "links": NavLink[],
  "categories": Category[]
}
```

---

## 数据结构

### NavLink 链接
```typescript
interface NavLink {
  id: string;              // 唯一标识
  title: string;           // 标题
  url: string;             // URL地址
  description: string;     // 描述
  logo?: string;           // Logo地址
  categoryId: string;      // 所属分类ID
  tags: string[];          // 标签数组
  featured?: boolean;      // 是否推荐
  order: number;           // 排序
  visible: boolean;        // 是否显示
  createdAt: string;       // 创建时间
  updatedAt: string;       // 更新时间
}
```

### Category 分类
```typescript
interface Category {
  id: string;              // 唯一标识
  name: string;            // 分类名称
  icon: string;            // 图标名称
  description?: string;    // 描述
  order: number;           // 排序
  visible: boolean;        // 是否显示
}
```

---

## 安全建议

### 1. 修改默认密码
生产环境务必修改默认密码：
```bash
# .env.local
ADMIN_PASSWORD=your_very_secure_password_here
```

### 2. 使用HTTPS
生产环境部署时启用HTTPS，确保Cookie安全传输

### 3. 定期备份
建议定期使用导出功能备份数据

### 4. 访问控制
可考虑添加IP白名单或其他安全措施

---

## 常见问题

### Q: 忘记密码怎么办？
A: 修改 `.env.local` 文件中的 `ADMIN_PASSWORD` 重启服务即可

### Q: 删除分类时提示有链接？
A: 需要先删除或移动该分类下的所有链接才能删除分类

### Q: 导入数据会覆盖现有数据吗？
A: 是的，导入会完全替换现有的链接和分类数据，请谨慎操作

### Q: 修改数据后前台不更新？
A: 刷新前台页面即可看到更新，所有修改实时生效

### Q: 支持批量导入链接吗？
A: 可以通过准备JSON文件后使用导入功能批量导入

---

## 技术栈

- **框架**: Next.js 16 App Router
- **认证**: Cookie-based Session
- **数据存储**: JSON文件 (`public/data/navigation.json`)
- **UI组件**: shadcn/ui + Radix UI
- **表单验证**: React Hook Form + Zod
- **通知提示**: Sonner Toast

---

## 版本历史

### v1.0.0 (2024-12-27)
- ✅ 完整的链接管理功能
- ✅ 分类管理功能
- ✅ 数据导入导出
- ✅ 统计数据展示
- ✅ 响应式设计
- ✅ 搜索和过滤功能

---

**开发者**: Modern Nav Team  
**文档更新**: 2024-12-27
