import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import https from 'https';
import dotenv from 'dotenv';
import { ipaAudioMapping } from './ipa-audio-mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少环境变量');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 计算文件名的 MD5 哈希
function getMD5Hash(filename) {
    return createHash('md5').update(filename).digest('hex');
}

// 构建 Wikimedia Commons URL
function getWikimediaUrl(filename) {
    const hash = getMD5Hash(filename);
    const prefix = hash.substring(0, 1);
    const subPrefix = hash.substring(0, 2);
    return `https://upload.wikimedia.org/wikipedia/commons/${prefix}/${subPrefix}/${filename}`;
}

// 下载文件
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(dest);
                });
            } else {
                fs.unlink(dest, () => { });
                reject(new Error(`下载失败: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

// 上传到 Supabase Storage
async function uploadToStorage(localPath, storagePath) {
    try {
        const fileBuffer = fs.readFileSync(localPath);
        const { data, error } = await supabase.storage
            .from('phonetics-audio')
            .upload(storagePath, fileBuffer, {
                contentType: 'audio/ogg',
                upsert: true
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from('phonetics-audio')
            .getPublicUrl(storagePath);

        return urlData.publicUrl;
    } catch (err) {
        throw new Error(`上传失败: ${err.message}`);
    }
}

// 更新数据库
async function updateDatabase(symbol, audioUrl) {
    const { error } = await supabase
        .from('phonetics')
        .update({ audio_url: audioUrl })
        .eq('symbol', symbol);

    if (error) throw error;
}

// 处理单个音标
async function processPhonetic(symbol, wikimediaFilename) {
    console.log(`\n📌 处理音标: ${symbol}`);

    try {
        // 1. 下载音频文件
        const wikimediaUrl = getWikimediaUrl(wikimediaFilename);
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const localPath = path.join(tempDir, wikimediaFilename);
        console.log(`  ⬇️  下载: ${wikimediaUrl}`);
        await downloadFile(wikimediaUrl, localPath);

        // 2. 上传到 Supabase Storage
        const storagePath = wikimediaFilename.replace('.ogg', `_${symbol.replace(/\//g, '')}.ogg`);
        console.log(`  ⬆️  上传到 Storage: ${storagePath}`);
        const publicUrl = await uploadToStorage(localPath, storagePath);

        // 3. 更新数据库
        console.log(`  💾 更新数据库`);
        await updateDatabase(symbol, publicUrl);

        // 4. 清理临时文件
        fs.unlinkSync(localPath);

        console.log(`  ✅ 完成: ${publicUrl}`);
        return { symbol, success: true, url: publicUrl };
    } catch (err) {
        console.error(`  ❌ 失败: ${err.message}`);
        return { symbol, success: false, error: err.message };
    }
}

// 主函数
async function main() {
    console.log('🚀 开始批量处理音标音频文件...\n');

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const [symbol, filename] of Object.entries(ipaAudioMapping)) {
        // 跳过已处理的 /i:/
        if (symbol === '/i:/') {
            console.log(`\n📌 跳过已处理: ${symbol}`);
            continue;
        }

        const result = await processPhonetic(symbol, filename);
        results.push(result);

        if (result.success) {
            successCount++;
        } else {
            failCount++;
        }

        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ 处理完成！`);
    console.log(`✅ 成功: ${successCount}`);
    console.log(`❌ 失败: ${failCount}`);
    console.log('='.repeat(60));

    // 输出失败的音标
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
        console.log('\n失败的音标:');
        failed.forEach(f => console.log(`  ${f.symbol}: ${f.error}`));
    }
}

main().catch(console.error);
