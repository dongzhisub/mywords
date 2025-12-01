# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 点击 "New Project"
5. 填写项目信息:
   - Name: `phonetics-learning`
   - Database Password: 设置一个强密码(记住它)
   - Region: 选择最近的区域(如 `Northeast Asia (Tokyo)`)
6. 点击 "Create new project"
7. 等待项目创建完成(约2分钟)

## 2. 获取 API 密钥

1. 在项目仪表板,点击左侧 "Settings" (齿轮图标)
2. 点击 "API"
3. 复制以下信息:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (很长的字符串)

## 3. 配置后端环境变量

在 `backend` 目录创建 `.env` 文件:

```bash
cd backend
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

## 4. 创建数据库表

### 方法1: 使用 SQL 编辑器 (推荐)

1. 在 Supabase 仪表板,点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 `backend/sql/init.sql` 的内容
4. 粘贴到编辑器
5. 点击 "Run" 执行

### 方法2: 使用 Table Editor

在 Supabase 仪表板,点击 "Table Editor",手动创建以下表:

#### phonetics 表
```sql
CREATE TABLE phonetics (
  id BIGSERIAL PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('vowel', 'consonant')),
  category VARCHAR(50),
  mouth_shape_image VARCHAR(255),
  video_url VARCHAR(255),
  audio_url VARCHAR(255),
  description TEXT,
  example_words JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phonetics_type ON phonetics(type);
CREATE INDEX idx_phonetics_category ON phonetics(category);
```

#### lessons 表
```sql
CREATE TABLE lessons (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  lesson_number INTEGER NOT NULL UNIQUE,
  duration INTEGER DEFAULT 480,
  phonetics_covered JSONB,
  confusion_pairs JSONB,
  pronunciation_rules TEXT,
  letter_rules JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_number ON lessons(lesson_number);
```

#### exercises 表
```sql
CREATE TABLE exercises (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('listen_choose', 'pair_compare', 'word_phonetic', 'minimal_pair')),
  question_text TEXT,
  audio_url VARCHAR(255),
  options JSONB,
  correct_answer VARCHAR(100),
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
```

#### student_progress 表
```sql
CREATE TABLE student_progress (
  id BIGSERIAL PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

CREATE INDEX idx_progress_student ON student_progress(student_id);
CREATE INDEX idx_progress_completed ON student_progress(completed);
```

## 5. 插入初始数据

在 SQL Editor 中执行 `backend/sql/init.sql` 中的 INSERT 语句,插入:
- 48个音标数据
- 3个示例课程
- 7道练习题

## 6. 配置 Row Level Security (RLS)

为了安全,建议启用 RLS:

```sql
-- 允许所有人读取音标和课程
ALTER TABLE phonetics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON phonetics FOR SELECT USING (true);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON lessons FOR SELECT USING (true);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON exercises FOR SELECT USING (true);

-- 学生进度表允许读写
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON student_progress FOR ALL USING (true);
```

## 7. 验证设置

启动后端服务:

```bash
cd backend
npm run dev
```

访问健康检查端点:
```bash
curl http://localhost:3001/health
```

应该返回:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": {
    "success": true,
    "type": "supabase",
    "url": "https://your-project.supabase.co"
  }
}
```

## 8. 测试 API

```bash
# 获取所有音标
curl http://localhost:3001/api/phonetics

# 获取所有课程
curl http://localhost:3001/api/lessons

# 获取课程1的练习题
curl http://localhost:3001/api/exercises/lesson/1
```

## 常见问题

### Q: RLS 策略导致无法访问数据?
A: 确保已创建正确的 RLS 策略,或临时禁用 RLS 进行测试:
```sql
ALTER TABLE phonetics DISABLE ROW LEVEL SECURITY;
```

### Q: CORS 错误?
A: Supabase 默认允许所有域名,如果有问题,检查后端的 CORS 配置。

### Q: 数据类型不匹配?
A: Supabase 使用 PostgreSQL,某些类型与 MySQL 不同:
- `INT` → `BIGINT` 或 `INTEGER`
- `ENUM` → `VARCHAR` + `CHECK` 约束
- `JSON` → `JSONB`

## 下一步

设置完成后:
1. 启动后端: `cd backend && npm run dev`
2. 启动前端: `cd frontend && npm run dev`
3. 访问: http://localhost:5173

## 有用的 Supabase 功能

- **Table Editor**: 可视化编辑数据
- **SQL Editor**: 执行 SQL 查询
- **Database**: 查看表结构和关系
- **API Docs**: 自动生成的 API 文档
- **Storage**: 可用于存储音频/视频文件(未来扩展)
