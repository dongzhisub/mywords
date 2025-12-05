#!/usr/bin/env python3
"""
上传口型图到 Supabase Storage
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

# 创建 Storage bucket (如果不存在)
def create_bucket_if_needed():
    """创建 phonetics-images bucket"""
    # 这个操作需要通过 SQL 完成，这里跳过
    pass

# 上传图片
def upload_image(local_path, storage_name):
    """上传图片到 Supabase Storage"""
    try:
        url = f"{SUPABASE_URL}/storage/v1/object/phonetics-images/{storage_name}"
        headers = {
            'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
            'Content-Type': 'image/png'
        }
        
        with open(local_path, 'rb') as f:
            response = requests.post(url, headers=headers, data=f, timeout=30)
        
        if response.status_code in [200, 201]:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/phonetics-images/{storage_name}"
            return True, public_url
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

# 图片映射
IMAGES = {
    '/ɪ/': 'frontend/public/images/phonetics/mouth_short_i.png',
    '/e/': 'frontend/public/images/phonetics/mouth_e.png',
    '/ɑ:/': 'frontend/public/images/phonetics/mouth_long_a.png',
    '/ɔ:/': 'frontend/public/images/phonetics/mouth_long_o.png',
    '/u:/': 'frontend/public/images/phonetics/mouth_long_u.png',
}

def main():
    print("🚀 上传口型图到 Supabase Storage...\n")
    
    results = []
    for symbol, local_path in IMAGES.items():
        print(f"📌 处理: {symbol}")
        
        if not os.path.exists(local_path):
            print(f"   ❌ 文件不存在: {local_path}")
            continue
        
        # 生成存储文件名
        filename = os.path.basename(local_path)
        
        print(f"   ⬆️  上传: {filename}")
        success, result = upload_image(local_path, filename)
        
        if success:
            print(f"   ✅ 成功: {result}")
            results.append((symbol, result))
        else:
            print(f"   ❌ 失败: {result}")
    
    print("\n" + "=" * 60)
    print(f"✨ 完成！成功上传 {len(results)} 张图片")
    print("=" * 60)
    
    if results:
        print("\n📝 数据库更新 SQL:")
        print("-" * 60)
        for symbol, url in results:
            print(f"UPDATE phonetics SET mouth_shape_image = '{url}' WHERE symbol = '{symbol}';")
        print("-" * 60)

if __name__ == '__main__':
    main()
