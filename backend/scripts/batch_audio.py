#!/usr/bin/env python3
"""
批量处理音标音频和口型图
从 Wikimedia Commons 下载资源并上传到 Supabase Storage
"""

import os
import sys
import hashlib
import requests
import time
from pathlib import Path
from dotenv import load_dotenv

# 加载环境变量
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("❌ 缺少环境变量 SUPABASE_URL 或 SUPABASE_ANON_KEY")
    sys.exit(1)

# IPA 音标到 Wikimedia 文件的映射（测试版 - 前10个）
PHONETICS_MAPPING = {
    # 元音
    '/ɪ/': 'Near-close_near-front_unrounded_vowel.ogg',
    '/e/': 'Close-mid_front_unrounded_vowel.ogg',
    '/æ/': 'Near-open_front_unrounded_vowel.ogg',
    '/ɑ:/': 'Open_back_unrounded_vowel.ogg',
    '/ɒ/': 'Open_back_rounded_vowel.ogg',
    '/ɔ:/': 'Open-mid_back_rounded_vowel.ogg',
    '/ʊ/': 'Near-close_near-back_rounded_vowel.ogg',
    '/u:/': 'Close_back_rounded_vowel.ogg',
    '/ʌ/': 'Open-mid_back_unrounded_vowel.ogg',
    '/ɜ:/': 'Open-mid_central_unrounded_vowel.ogg',
}

def get_md5_hash(text):
    """计算字符串的 MD5 哈希"""
    return hashlib.md5(text.encode()).hexdigest()

def get_wikimedia_url(filename):
    """构建 Wikimedia Commons 文件 URL"""
    hash_val = get_md5_hash(filename)
    prefix = hash_val[0]
    subprefix = hash_val[:2]
    return f"https://upload.wikimedia.org/wikipedia/commons/{prefix}/{subprefix}/{filename}"

def download_file(url, dest_path):
    """下载文件"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200 and len(response.content) > 1000:
            with open(dest_path, 'wb') as f:
                f.write(response.content)
            return True, len(response.content)
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def upload_to_storage(file_path, storage_path):
    """上传文件到 Supabase Storage"""
    try:
        url = f"{SUPABASE_URL}/storage/v1/object/phonetics-audio/{storage_path}"
        headers = {
            'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
            'Content-Type': 'audio/ogg'
        }
        
        with open(file_path, 'rb') as f:
            response = requests.post(url, headers=headers, data=f, timeout=30)
        
        if response.status_code in [200, 201]:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/phonetics-audio/{storage_path}"
            return True, public_url
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def process_phonetic(symbol, filename, temp_dir, phonetic_id=None):
    """处理单个音标"""
    print(f"\n📌 处理音标: {symbol}")
    print(f"   文件: {filename}")
    
    # 1. 下载音频
    wikimedia_url = get_wikimedia_url(filename)
    local_path = temp_dir / filename
    
    print(f"   ⬇️  下载中...")
    success, result = download_file(wikimedia_url, local_path)
    
    if not success:
        print(f"   ❌ 下载失败: {result}")
        return False, None
    
    print(f"   ✅ 下载成功 ({result} bytes)")
    
    # 2. 上传到 Storage
    # 使用简化的 ASCII 文件名（基于原文件名 + ID）
    base_name = filename.replace('.ogg', '').replace('-', '_').replace(' ', '_')
    # 如果有 phonetic_id，使用它；否则使用符号的哈希
    if phonetic_id:
        storage_name = f"phonetic_{phonetic_id}.ogg"
    else:
        # 使用符号的简短哈希
        symbol_hash = hashlib.md5(symbol.encode()).hexdigest()[:8]
        storage_name = f"{base_name}_{symbol_hash}.ogg"
    
    print(f"   ⬆️  上传到 Storage: {storage_name}")
    success, result = upload_to_storage(local_path, storage_name)
    
    if not success:
        print(f"   ❌ 上传失败: {result}")
        return False, None
    
    print(f"   ✅ 上传成功")
    print(f"   💾 URL: {result}")
    
    # 清理临时文件
    local_path.unlink()
    
    return True, result

def main():
    print("🚀 开始批量处理音标音频文件...\n")
    
    # 创建临时目录
    temp_dir = Path(__file__).parent.parent.parent / 'temp' / 'audio'
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    results = []
    success_count = 0
    fail_count = 0
    
    for symbol, filename in PHONETICS_MAPPING.items():
        success, url = process_phonetic(symbol, filename, temp_dir)
        
        if success:
            results.append((symbol, url))
            success_count += 1
        else:
            fail_count += 1
        
        # 延迟避免请求过快
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print("✨ 处理完成！")
    print(f"✅ 成功: {success_count}")
    print(f"❌ 失败: {fail_count}")
    print("=" * 60)
    
    # 输出 SQL 更新语句
    if results:
        print("\n📝 数据库更新 SQL:")
        print("-" * 60)
        for symbol, url in results:
            print(f"UPDATE phonetics SET audio_url = '{url}' WHERE symbol = '{symbol}';")
        print("-" * 60)

if __name__ == '__main__':
    main()
