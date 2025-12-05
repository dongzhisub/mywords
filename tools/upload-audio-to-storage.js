import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少 SUPABASE_URL 或 SUPABASE_ANON_KEY 环境变量');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAudioFile(localPath, storagePath) {
    try {
        console.log(`📤 正在上传: ${localPath} -> ${storagePath}`);

        // 读取文件
        const fileBuffer = fs.readFileSync(localPath);

        // 上传到 Supabase Storage
        const { data, error } = await supabase.storage
            .from('phonetics-audio')
            .upload(storagePath, fileBuffer, {
                contentType: 'audio/ogg',
                upsert: true // 如果文件已存在则覆盖
            });

        if (error) {
            console.error(`❌ 上传失败: ${error.message}`);
            return null;
        }

        // 获取公开 URL
        const { data: urlData } = supabase.storage
            .from('phonetics-audio')
            .getPublicUrl(storagePath);

        console.log(`✅ 上传成功: ${urlData.publicUrl}`);
        return urlData.publicUrl;
    } catch (err) {
        console.error(`❌ 上传出错: ${err.message}`);
        return null;
    }
}

async function main() {
    console.log('🚀 开始上传音频文件到 Supabase Storage...\n');

    // 上传 /i:/ 的音频文件
    const audioPath = path.join(__dirname, '../../frontend/public/audio/i_long.ogg');
    const publicUrl = await uploadAudioFile(audioPath, 'i_long.ogg');

    if (publicUrl) {
        console.log('\n📝 请更新数据库:');
        console.log(`UPDATE phonetics SET audio_url = '${publicUrl}' WHERE symbol = '/i:/';`);
    }

    console.log('\n✨ 完成！');
}

main();
