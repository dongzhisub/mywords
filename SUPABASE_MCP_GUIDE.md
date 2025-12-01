# 使用 Supabase MCP 初始化数据库

## 什么是 MCP?

MCP (Model Context Protocol) 是一个标准化协议,允许AI助手与外部服务(如Supabase)进行交互。

## 配置 Supabase MCP

### 步骤 1: 获取 Supabase Service Role Key

⚠️ **重要**: MCP需要Service Role Key,而不是anon key

1. 访问你的Supabase项目
2. 点击 Settings → API
3. 复制 **service_role** key (以 `eyJ` 开头的长字符串)
4. ⚠️ 这个key有完全权限,请妥善保管!

### 步骤 2: 配置 Antigravity MCP

Antigravity需要在配置文件中添加Supabase MCP服务器。

**方法A: 通过UI配置** (如果Antigravity支持)
1. 打开Antigravity设置
2. 找到 MCP Servers 配置
3. 添加Supabase服务器:
   ```json
   {
     "name": "supabase",
     "type": "supabase",
     "config": {
       "supabaseUrl": "https://your-project.supabase.co",
       "supabaseKey": "your_service_role_key"
     }
   }
   ```

**方法B: 手动配置文件** (如果需要)
编辑 Antigravity 配置文件(通常在 `~/.config/antigravity/` 或类似位置):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key"
      }
    }
  }
}
```

### 步骤 3: 重启 Antigravity

配置完成后,重启Antigravity以加载MCP服务器。

## 使用 MCP 初始化数据库

配置完成后,你可以通过以下方式使用MCP:

### 方式1: 直接请求AI助手

```
请使用Supabase MCP执行以下操作:
1. 读取 backend/sql/init.sql 文件
2. 在Supabase中执行这个SQL脚本
3. 验证数据是否正确插入
```

### 方式2: 使用MCP资源

AI助手可以:
- 列出Supabase表: `list_resources` → supabase
- 查询数据: 通过MCP工具查询表
- 执行SQL: 通过MCP执行SQL语句

## 验证 MCP 配置

配置完成后,你可以测试:

```
请列出Supabase MCP的可用资源
```

如果配置正确,AI助手应该能够:
- 看到你的Supabase表
- 查询数据
- 执行SQL操作

## 当前项目的MCP初始化流程

一旦MCP配置完成,初始化流程应该是:

1. **读取SQL文件**
   ```
   请读取 backend/sql/init.sql
   ```

2. **执行SQL**
   ```
   请使用Supabase MCP执行这个SQL脚本
   ```

3. **验证数据**
   ```
   请查询phonetics表,确认有48条记录
   请查询lessons表,确认有3条记录
   请查询exercises表,确认有7条记录
   ```

## 故障排除

### MCP服务器未找到

**错误**: `server name supabase not found`

**原因**: Supabase MCP未配置或未启动

**解决**:
1. 检查Antigravity配置文件
2. 确认已重启Antigravity
3. 检查MCP服务器日志

### 权限错误

**错误**: `permission denied` 或 `insufficient privileges`

**原因**: 使用了anon key而不是service_role key

**解决**: 使用service_role key配置MCP

### 连接失败

**错误**: `connection failed` 或 `timeout`

**原因**: Supabase URL或Key错误

**解决**:
1. 验证SUPABASE_URL格式正确
2. 验证service_role key完整复制
3. 检查网络连接

## 备选方案

如果MCP配置遇到困难,你仍然可以:

### 方案1: 使用验证脚本
```bash
cd backend
npm run init-db
```

### 方案2: 手动在SQL Editor执行
1. 访问Supabase仪表板
2. 打开SQL Editor
3. 执行 `backend/sql/init.sql`

### 方案3: 使用Supabase CLI
```bash
# 安装Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 执行SQL
supabase db push
```

## 推荐流程

对于这个项目,我推荐:

1. **首次设置**: 手动在SQL Editor执行(最简单)
2. **验证**: 使用 `npm run init-db` 验证
3. **后续**: 如果需要频繁重置数据库,再配置MCP

MCP主要优势在于可以通过AI助手直接操作数据库,但对于一次性初始化,手动执行可能更直接。

## 需要帮助?

如果你想配置MCP,请告诉我:
1. 你使用的Antigravity版本
2. 配置文件的位置
3. 是否有MCP配置界面

我可以提供更具体的配置指导!
