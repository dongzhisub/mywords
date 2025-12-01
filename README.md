# 英语音标学习系统

面向5年级小学生的英语音标学习课程系统,通过8分钟微课程提高辨音能力。

## 技术栈

- **前端**: React + Vite
- **后端**: Node.js + Express
- **数据库**: Supabase (PostgreSQL)

## 项目结构

```
phonetics-learning/
├── frontend/          # React前端
├── backend/           # Node.js后端
└── README.md
```

## 快速开始

### 1. 设置 Supabase

1. 访问 [Supabase](https://supabase.com) 创建免费账号
2. 创建新项目
3. 在 SQL Editor 中执行 `backend/sql/init.sql`
4. 获取 Project URL 和 anon key

详细步骤请查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 2. 配置后端

```bash
cd backend
npm install

# 创建 .env 文件
cp .env.example .env

# 编辑 .env,填入你的 Supabase 信息
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_anon_key
```

### 3. 启动后端

```bash
npm run dev
```

后端运行在: http://localhost:3001

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在: http://localhost:5173

访问: http://localhost:5173

## 功能特性

- 📚 48个国际音标完整覆盖
- 🎬 发音视频和音频教学
- 🔄 易混淆音标对比学习
- 📝 辨音练习题系统
- 📊 学习进度追踪

## 免费资源来源

- **音频**: YouGlish API / Forvo API
- **视频**: YouTube嵌入 (Creative Commons)
- **口型图**: AI生成 + 开源图库

## 开发计划

1. ✅ 项目初始化
2. 🔄 数据库设计
3. ⏳ 后端API开发
4. ⏳ 前端界面开发
5. ⏳ 资源整合
6. ⏳ 测试部署
