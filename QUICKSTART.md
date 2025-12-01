# 快速启动指南 (Supabase版本)

## 前置要求

- Node.js 16+
- npm
- Supabase 账号 (免费)

## 步骤 1: 设置 Supabase

### 创建项目

1. 访问 https://supabase.com
2. 点击 "Start your project" 并登录
3. 点击 "New Project"
4. 填写项目信息:
   - Name: `phonetics-learning`
   - Database Password: 设置强密码
   - Region: 选择最近的区域
5. 等待项目创建完成(约2分钟)

### 创建数据库表

1. 在 Supabase 仪表板,点击 "SQL Editor"
2. 点击 "New query"
3. 复制 `backend/sql/init.sql` 的全部内容
4. 粘贴并点击 "Run"
5. 等待执行完成,应该看到成功消息

### 获取 API 密钥

1. 点击左侧 "Settings" → "API"
2. 复制以下信息:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (长字符串)

## 步骤 2: 配置后端

```bash
cd backend

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env
```

编辑 `.env` 文件,填入你的 Supabase 信息:

```env
HOST=localhost
PORT=3001

# Supabase配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 步骤 3: 启动后端

```bash
npm run dev
```

你应该看到:
```
🚀 Server is running on http://localhost:3001
📚 API Documentation: http://localhost:3001/
💚 Health check: http://localhost:3001/health
```

测试连接:
```bash
curl http://localhost:3001/health
```

## 步骤 4: 启动前端

打开新终端:

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将运行在 http://localhost:5173

## 步骤 5: 访问应用

打开浏览器访问: **http://localhost:5173**

## 功能测试清单

- [ ] 查看课程列表(应显示3个课程)
- [ ] 点击"第1课"进入学习
  - [ ] Part 1: 查看音标 /i:/ 和 /ɪ/,播放发音
  - [ ] Part 2: 查看易混淆对比
  - [ ] Part 3: 阅读发音规律
  - [ ] Part 4: 完成练习题
- [ ] 查看"我的进度"页面
- [ ] 验证进度数据已保存

## 验证数据

在 Supabase 仪表板的 "Table Editor" 中检查:

- `phonetics` 表: 应有 48 条记录
- `lessons` 表: 应有 3 条记录
- `exercises` 表: 应有 7 条记录
- `student_progress` 表: 完成课程后会有数据

## 故障排除

### 后端无法连接 Supabase

**错误**: `❌ 错误: 请在.env文件中配置SUPABASE_URL和SUPABASE_ANON_KEY`

**解决**:
1. 确认 `backend/.env` 文件存在
2. 检查环境变量格式正确
3. 重启后端服务

### API 返回空数据

**可能原因**: 数据库表未创建或数据未插入

**解决**:
1. 在 Supabase SQL Editor 重新执行 `init.sql`
2. 检查 Table Editor 确认数据存在

### CORS 错误

**解决**: Supabase 默认允许所有域名,检查后端 CORS 配置

### RLS (Row Level Security) 错误

**错误**: `new row violates row-level security policy`

**解决**: 在 SQL Editor 执行:
```sql
ALTER TABLE phonetics DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress DISABLE ROW LEVEL SECURITY;
```

或者创建正确的 RLS 策略(参考 SUPABASE_SETUP.md)

## 下一步

1. ✅ 测试完整的学习流程
2. 📚 添加更多课程数据
3. 🎬 整合真实音视频资源(参考 RESOURCES.md)
4. 🚀 部署到生产环境

## 有用的命令

```bash
# 查看后端日志
cd backend && npm run dev

# 重新安装依赖
cd backend && rm -rf node_modules && npm install

# 测试 API
curl http://localhost:3001/api/phonetics
curl http://localhost:3001/api/lessons
curl http://localhost:3001/api/exercises/lesson/1
```

## 相关文档

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - 详细的 Supabase 设置指南
- [RESOURCES.md](./RESOURCES.md) - 免费音视频资源方案
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目总结

---

**🎉 享受学习音标的乐趣!**
