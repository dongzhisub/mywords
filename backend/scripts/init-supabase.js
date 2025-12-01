import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 错误: 请先配置 SUPABASE_URL 和 SUPABASE_ANON_KEY');
    console.log('\n请按照以下步骤操作:');
    console.log('1. 访问 https://supabase.com 创建项目');
    console.log('2. 在 Settings → API 获取 URL 和 anon key');
    console.log('3. 复制 .env.example 为 .env 并填入信息');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 开始初始化 Supabase 数据库...\n');

async function initDatabase() {
    try {
        // 读取SQL文件
        const sqlPath = join(__dirname, '../sql/init.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 已读取 SQL 初始化脚本');
        console.log('⚠️  注意: 请在 Supabase SQL Editor 中手动执行以下步骤:\n');
        console.log('1. 访问你的 Supabase 项目仪表板');
        console.log('2. 点击左侧 "SQL Editor"');
        console.log('3. 点击 "New query"');
        console.log('4. 复制粘贴 backend/sql/init.sql 的内容');
        console.log('5. 点击 "Run" 执行\n');

        console.log('📊 验证数据库连接...');

        // 测试连接
        const { data: testData, error: testError } = await supabase
            .from('phonetics')
            .select('count', { count: 'exact', head: true });

        if (testError) {
            if (testError.message.includes('relation "public.phonetics" does not exist')) {
                console.log('⚠️  数据库表尚未创建');
                console.log('📝 请在 Supabase SQL Editor 中执行 init.sql 脚本\n');
                return;
            }
            throw testError;
        }

        // 检查数据
        const { count: phoneticsCount } = await supabase
            .from('phonetics')
            .select('*', { count: 'exact', head: true });

        const { count: lessonsCount } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true });

        const { count: exercisesCount } = await supabase
            .from('exercises')
            .select('*', { count: 'exact', head: true });

        console.log('✅ 数据库连接成功!\n');
        console.log('📊 当前数据统计:');
        console.log(`  - 音标数量: ${phoneticsCount || 0}`);
        console.log(`  - 课程数量: ${lessonsCount || 0}`);
        console.log(`  - 练习题数量: ${exercisesCount || 0}\n`);

        if (phoneticsCount === 48 && lessonsCount >= 3 && exercisesCount >= 7) {
            console.log('🎉 数据库已完整初始化!');
            console.log('✨ 可以启动后端服务了: npm run dev\n');
        } else if (phoneticsCount === 0) {
            console.log('⚠️  数据库表已创建但数据为空');
            console.log('📝 请确保在 SQL Editor 中执行了完整的 INSERT 语句\n');
        } else {
            console.log('⚠️  数据不完整,建议重新执行 init.sql\n');
        }

    } catch (error) {
        console.error('❌ 错误:', error.message);
        console.log('\n💡 提示:');
        console.log('1. 确认 Supabase 项目已创建');
        console.log('2. 确认 .env 文件配置正确');
        console.log('3. 在 Supabase SQL Editor 中执行 init.sql');
        process.exit(1);
    }
}

initDatabase();
