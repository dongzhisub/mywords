# 免费音标资源整合方案

本文档说明如何获取和使用免费的英语音标发音资源。

## 音频资源

### 方案1: Web Speech API (已集成)
- **优点**: 浏览器内置,无需额外资源
- **实现**: 已在PhoneticCard组件中实现
- **使用**: 自动朗读示例单词

### 方案2: Forvo API (推荐)
- **网站**: https://forvo.com
- **说明**: 全球最大的发音词典
- **免费额度**: 500次/天
- **使用方法**:
  1. 注册账号: https://api.forvo.com/
  2. 获取API Key
  3. 更新.env文件: `FORVO_API_KEY=your_key`
  4. 音频URL格式: `https://forvo.com/word/{word}/#en`

### 方案3: Cambridge Dictionary
- **网站**: https://dictionary.cambridge.org
- **说明**: 剑桥词典提供美式和英式发音
- **音频URL**: 可通过爬取获取(需遵守使用条款)

## 视频资源

### 方案1: YouTube嵌入 (推荐)
以下是优质的音标教学视频频道:

1. **BBC Learning English**
   - 频道: https://www.youtube.com/@bbclearningenglish
   - 音标系列: "The Sounds of English"
   - 许可: Creative Commons (部分视频)

2. **Rachel's English**
   - 频道: https://www.youtube.com/@rachelsenglish
   - 特点: 详细的口型演示
   - 嵌入示例: `https://www.youtube.com/embed/VIDEO_ID`

3. **English with Lucy**
   - 频道: https://www.youtube.com/@EnglishwithLucy
   - 特点: 清晰的发音教学

### 方案2: 自制视频
使用AI工具生成口型动画:
- D-ID: https://www.d-id.com (免费额度)
- Synthesia: https://www.synthesia.io (试用版)

## 口型图资源

### 方案1: 开源图库
1. **IPA Chart with Sounds**
   - 网站: https://www.ipachart.com
   - 许可: 可免费使用
   - 下载: 提供SVG格式

2. **Wikimedia Commons**
   - 搜索: "IPA mouth position"
   - 许可: Public Domain / CC-BY-SA

### 方案2: AI生成 (已实现)
可使用generate_image工具生成口型示意图

## 数据库音频URL配置示例

```sql
-- 更新音标表,添加免费资源URL
UPDATE phonetics SET 
  audio_url = 'https://forvo.com/word/example/#en',
  video_url = 'https://www.youtube.com/embed/VIDEO_ID',
  mouth_shape_image = '/images/phonetics/i_mouth.svg'
WHERE symbol = '/i:/';
```

## 实施步骤

1. **音频**: 使用Web Speech API(已实现) + 可选Forvo API增强
2. **视频**: 
   - 短期: 使用YouTube嵌入链接
   - 长期: 录制或生成自有视频
3. **口型图**: 
   - 从ipachart.com下载
   - 或使用AI生成工具

## 注意事项

⚠️ **版权合规**:
- YouTube嵌入需遵守其服务条款
- 使用第三方资源前检查许可证
- 商业使用需获得授权

⚠️ **性能优化**:
- 视频使用懒加载
- 音频文件压缩为MP3格式
- 图片使用WebP格式

## 资源更新脚本

创建 `backend/scripts/update-resources.js`:
```javascript
// 批量更新音标资源URL
// 可从免费API获取并更新数据库
```
