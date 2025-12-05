#!/bin/bash

# 批量处理音标音频文件的简化脚本
# 使用 curl 直接下载和上传，避免 Node.js 依赖问题

set -e

# 加载环境变量
source backend/.env

# 创建临时目录
mkdir -p temp/audio

# 定义要处理的音标（测试用 - 前5个元音）
declare -A PHONETICS=(
  ["/ɪ/"]="Near-close_near-front_unrounded_vowel.ogg"
  ["/e/"]="Close-mid_front_unrounded_vowel.ogg"
  ["/æ/"]="Near-open_front_unrounded_vowel.ogg"
  ["/ɑ:/"]="Open_back_unrounded_vowel.ogg"
  ["/ɒ/"]="Open_back_rounded_vowel.ogg"
)

echo "🚀 开始批量处理音标音频..."
echo ""

SUCCESS=0
FAIL=0

for symbol in "${!PHONETICS[@]}"; do
  filename="${PHONETICS[$symbol]}"
  echo "📌 处理音标: $symbol"
  echo "   文件: $filename"
  
  # 计算 MD5 哈希
  hash=$(echo -n "$filename" | md5)
  prefix=${hash:0:1}
  subprefix=${hash:0:2}
  
  # 构建 Wikimedia URL
  url="https://upload.wikimedia.org/wikipedia/commons/$prefix/$subprefix/$filename"
  
  # 下载文件
  echo "   ⬇️  下载中..."
  if curl -L -A "Mozilla/5.0" -o "temp/audio/$filename" "$url" 2>/dev/null; then
    # 检查文件大小
    filesize=$(wc -c < "temp/audio/$filename" | tr -d ' ')
    if [ "$filesize" -gt 1000 ]; then
      echo "   ✅ 下载成功 ($filesize bytes)"
      
      # 上传到 Supabase Storage
      storage_name="${filename%.ogg}_${symbol//\//}.ogg"
      echo "   ⬆️  上传到 Storage: $storage_name"
      
      upload_result=$(curl -X POST \
        "https://wphlvatgbxcqbrlwschr.supabase.co/storage/v1/object/phonetics-audio/$storage_name" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: audio/ogg" \
        --data-binary "@temp/audio/$filename" \
        2>/dev/null)
      
      if echo "$upload_result" | grep -q "Key"; then
        echo "   ✅ 上传成功"
        
        # 构建公开 URL
        public_url="https://wphlvatgbxcqbrlwschr.supabase.co/storage/v1/object/public/phonetics-audio/$storage_name"
        
        echo "   💾 URL: $public_url"
        echo "   📝 请手动更新数据库:"
        echo "      UPDATE phonetics SET audio_url = '$public_url' WHERE symbol = '$symbol';"
        
        SUCCESS=$((SUCCESS + 1))
      else
        echo "   ❌ 上传失败: $upload_result"
        FAIL=$((FAIL + 1))
      fi
    else
      echo "   ❌ 下载失败（文件过小，可能是错误页面）"
      FAIL=$((FAIL + 1))
    fi
  else
    echo "   ❌ 下载失败"
    FAIL=$((FAIL + 1))
  fi
  
  echo ""
  sleep 1
done

echo "============================================"
echo "✨ 处理完成！"
echo "✅ 成功: $SUCCESS"
echo "❌ 失败: $FAIL"
echo "============================================"
