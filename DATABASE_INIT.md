# Supabase 数据库初始化指南

## 方法1: 使用验证脚本 (推荐)

这个脚本会验证你的Supabase连接并检查数据库状态:

```bash
cd backend
npm run init-db
```

脚本会:
- ✅ 验证Supabase连接
- ✅ 检查表是否存在
- ✅ 统计现有数据
- ✅ 提供初始化指导

## 方法2: 手动在Supabase SQL Editor执行

### 步骤:

1. **登录Supabase**
   - 访问 https://supabase.com
   - 进入你的项目

2. **打开SQL Editor**
   - 点击左侧菜单 "SQL Editor"
   - 点击 "New query"

3. **执行初始化脚本**
   - 复制 `backend/sql/init.sql` 的全部内容
   - 粘贴到SQL编辑器
   - 点击 "Run" 或按 Cmd/Ctrl + Enter

4. **验证结果**
   ```bash
   cd backend
   npm run init-db
   ```

## 预期结果

执行成功后应该看到:

```
✅ 数据库连接成功!

📊 当前数据统计:
  - 音标数量: 48
  - 课程数量: 3
  - 练习题数量: 7

🎉 数据库已完整初始化!
✨ 可以启动后端服务了: npm run dev
```

## 故障排除

### 错误: "请先配置 SUPABASE_URL 和 SUPABASE_ANON_KEY"

**解决**:
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件,填入你的Supabase信息
```

### 错误: "relation public.phonetics does not exist"

**原因**: 数据库表尚未创建

**解决**: 在Supabase SQL Editor中执行 `init.sql`

### 数据不完整

**解决**: 
1. 在Supabase仪表板,点击 "Table Editor"
2. 删除所有表
3. 重新在SQL Editor执行完整的 `init.sql`

## 使用MCP (可选)

如果你想使用Supabase MCP服务器,需要:

1. **安装Supabase MCP**
   ```bash
   npm install -g @modelcontextprotocol/server-supabase
   ```

2. **配置MCP**
   - 在Antigravity设置中添加Supabase MCP服务器
   - 提供Supabase URL和Service Role Key

3. **使用MCP工具**
   - 可以通过MCP直接查询和操作Supabase

**注意**: 当前项目使用Supabase JavaScript SDK已经足够,MCP是可选的高级功能。

## 下一步

数据库初始化完成后:

```bash
# 启动后端
cd backend
npm run dev

# 启动前端(新终端)
cd frontend
npm run dev
```

访问: http://localhost:5173
