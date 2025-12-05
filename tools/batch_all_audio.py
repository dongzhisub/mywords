#!/usr/bin/env python3
"""
完整版：批量处理所有48个音标的音频文件
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
    print("❌ 缺少环境变量")
    sys.exit(1)

# 完整的 IPA 音标映射
ALL_PHONETICS = {
    # 双元音 (使用第一个元音的音频)
    '/ə/': 'Mid-central_vowel.ogg',
    '/eɪ/': 'Close-mid_front_unrounded_vowel.ogg',
    '/aɪ/': 'Open_front_unrounded_vowel.ogg',
    '/ɔɪ/': 'Open-mid_back_rounded_vowel.ogg',
    '/aʊ/': 'Open_front_unrounded_vowel.ogg',
    '/əʊ/': 'Mid-central_vowel.ogg',
    '/ɪə/': 'Near-close_near-front_unrounded_vowel.ogg',
    '/eə/': 'Close-mid_front_unrounded_vowel.ogg',
    '/ʊə/': 'Near-close_near-back_rounded_vowel.ogg',
    
    # 辅音
    '/p/': 'Voiceless_bilabial_plosive.ogg',
    '/b/': 'Voiced_bilabial_plosive.ogg',
    '/t/': 'Voiceless_alveolar_plosive.ogg',
    '/d/': 'Voiced_alveolar_plosive.ogg',
    '/k/': 'Voiceless_velar_plosive.ogg',
    '/g/': 'Voiced_velar_plosive.ogg',
    '/f/': 'Voiceless_labiodental_fricative.ogg',
    '/v/': 'Voiced_labiodental_fricative.ogg',
    '/θ/': 'Voiceless_dental_fricative.ogg',
    '/ð/': 'Voiced_dental_fricative.ogg',
    '/s/': 'Voiceless_alveolar_sibilant.ogg',
    '/z/': 'Voiced_alveolar_sibilant.ogg',
    '/ʃ/': 'Voiceless_palato-alveolar_sibilant.ogg',
    '/ʒ/': 'Voiced_palato-alveolar_sibilant.ogg',
    '/h/': 'Voiceless_glottal_fricative.ogg',
    '/m/': 'Bilabial_nasal.ogg',
    '/n/': 'Alveolar_nasal.ogg',
    '/ŋ/': 'Velar_nasal.ogg',
    '/l/': 'Alveolar_lateral_approximant.ogg',
    '/r/': 'Alveolar_approximant.ogg',
    '/j/': 'Palatal_approximant.ogg',
    '/w/': 'Labio-velar_approximant.ogg',
    '/tʃ/': 'Voiceless_palato-alveolar_affricate.ogg',
    '/dʒ/': 'Voiced_palato-alveolar_affricate.ogg',
    '/tr/': 'Voiceless_alveolar_plosive.ogg',  # 使用 /t/
    '/dr/': 'Voiced_alveolar_plosive.ogg',     # 使用 /d/
    '/ts/': 'Voiceless_alveolar_plosive.ogg',  # 使用 /t/
    '/dz/': 'Voiced_alveolar_plosive.ogg',     # 使用 /d/
}

def get_md5_hash(text):
    return hashlib.md5(text.encode()).hexdigest()

def get_wikimedia_url(filename):
    hash_val = get_md5_hash(filename)
    prefix = hash_val[0]
    subprefix = hash_val[:2]
    return f"https://upload.wikimedia.org/wikipedia/commons/{prefix}/{subprefix}/{filename}"

def download_file(url, dest_path):
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

def process_phonetic(symbol, filename, temp_dir):
    print(f"\n📌 处理音标: {symbol}")
    
    wikimedia_url = get_wikimedia_url(filename)
    local_path = temp_dir / filename
    
    print(f"   ⬇️  下载中...")
    success, result = download_file(wikimedia_url, local_path)
    
    if not success:
        print(f"   ❌ 下载失败: {result}")
        return False, None
    
    print(f"   ✅ 下载成功 ({result} bytes)")
    
    base_name = filename.replace('.ogg', '').replace('-', '_').replace(' ', '_')
    symbol_hash = hashlib.md5(symbol.encode()).hexdigest()[:8]
    storage_name = f"{base_name}_{symbol_hash}.ogg"
    
    print(f"   ⬆️  上传到 Storage...")
    success, result = upload_to_storage(local_path, storage_name)
    
    if not success:
        print(f"   ❌ 上传失败")
        return False, None
    
    print(f"   ✅ 完成")
    local_path.unlink()
    
    return True, result

def main():
    print("🚀 批量处理所有音标音频文件...\n")
    
    temp_dir = Path(__file__).parent.parent.parent / 'temp' / 'audio'
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    results = []
    success_count = 0
    fail_count = 0
    
    for symbol, filename in ALL_PHONETICS.items():
        success, url = process_phonetic(symbol, filename, temp_dir)
        
        if success:
            results.append((symbol, url))
            success_count += 1
        else:
            fail_count += 1
        
        time.sleep(0.5)  # 减少延迟
    
    print("\n" + "=" * 60)
    print(f"✨ 完成！成功: {success_count}, 失败: {fail_count}")
    print("=" * 60)
    
    if results:
        print("\n📝 数据库更新 SQL:")
        print("-" * 60)
        for symbol, url in results:
            print(f"UPDATE phonetics SET audio_url = '{url}' WHERE symbol = '{symbol}';")
        print("-" * 60)

if __name__ == '__main__':
    main()
