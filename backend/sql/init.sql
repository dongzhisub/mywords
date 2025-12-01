-- 创建数据库
CREATE DATABASE IF NOT EXISTS phonetics_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE phonetics_learning;

-- 1. 音标表
CREATE TABLE IF NOT EXISTS phonetics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  symbol VARCHAR(10) NOT NULL UNIQUE COMMENT '音标符号 如 /i:/',
  type ENUM('vowel', 'consonant') NOT NULL COMMENT '元音/辅音',
  category VARCHAR(50) COMMENT '分类: 单元音/双元音/清辅音/浊辅音等',
  mouth_shape_image VARCHAR(255) COMMENT '口型图路径',
  video_url VARCHAR(255) COMMENT '发音视频URL',
  audio_url VARCHAR(255) COMMENT '音频URL',
  description TEXT COMMENT '发音要点描述',
  example_words JSON COMMENT '示例单词数组',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='音标基础信息表';

-- 2. 课程表
CREATE TABLE IF NOT EXISTS lessons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL COMMENT '课程标题',
  lesson_number INT NOT NULL UNIQUE COMMENT '课程序号',
  duration INT DEFAULT 480 COMMENT '时长(秒) 默认8分钟',
  phonetics_covered JSON COMMENT '本课涵盖的音标ID数组',
  confusion_pairs JSON COMMENT '易混淆音标对 [{pair: [id1, id2], tips: ""}]',
  pronunciation_rules TEXT COMMENT '发音规律总结',
  letter_rules JSON COMMENT '字母发音规律 [{letter: "a", rules: [], examples: []}]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lesson_number (lesson_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程信息表';

-- 3. 练习题表
CREATE TABLE IF NOT EXISTS exercises (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lesson_id INT NOT NULL COMMENT '关联课程',
  question_type ENUM('listen_choose', 'pair_compare', 'word_phonetic', 'minimal_pair') NOT NULL COMMENT '题型',
  question_text TEXT COMMENT '题目文本',
  audio_url VARCHAR(255) COMMENT '题目音频',
  options JSON COMMENT '选项数组',
  correct_answer VARCHAR(100) COMMENT '正确答案',
  explanation TEXT COMMENT '解析',
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium' COMMENT '难度',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  INDEX idx_lesson (lesson_id),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='练习题表';

-- 4. 学生进度表
CREATE TABLE IF NOT EXISTS student_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) NOT NULL COMMENT '学生ID',
  lesson_id INT NOT NULL COMMENT '课程ID',
  completed BOOLEAN DEFAULT FALSE COMMENT '是否完成',
  score INT COMMENT '练习得分',
  time_spent INT COMMENT '学习时长(秒)',
  completed_at TIMESTAMP NULL COMMENT '完成时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_lesson (student_id, lesson_id),
  INDEX idx_student (student_id),
  INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生学习进度表';

-- 插入48个国际音标数据
INSERT INTO phonetics (symbol, type, category, description, example_words) VALUES
-- 单元音 (12个)
('/i:/', 'vowel', '长元音', '长音i，嘴唇微笑，舌尖抵下齿', '["see", "tea", "meet", "feet"]'),
('/ɪ/', 'vowel', '短元音', '短音i，嘴唇放松，舌位略低', '["sit", "big", "ship", "fit"]'),
('/e/', 'vowel', '短元音', '舌尖抵下齿，嘴巴半开', '["bed", "pen", "red", "get"]'),
('/æ/', 'vowel', '短元音', '嘴巴张大，舌位最低', '["cat", "bad", "map", "hat"]'),
('/ɑ:/', 'vowel', '长元音', '嘴巴大张，舌位靠后', '["car", "far", "park", "arm"]'),
('/ɒ/', 'vowel', '短元音', '嘴唇圆，舌位靠后', '["hot", "dog", "box", "got"]'),
('/ɔ:/', 'vowel', '长元音', '嘴唇圆，舌位靠后', '["door", "saw", "ball", "call"]'),
('/ʊ/', 'vowel', '短元音', '嘴唇圆，舌位靠后', '["book", "good", "look", "put"]'),
('/u:/', 'vowel', '长元音', '嘴唇圆，舌位最高最后', '["food", "moon", "blue", "too"]'),
('/ʌ/', 'vowel', '短元音', '嘴巴半开，舌位中', '["cup", "bus", "run", "but"]'),
('/ɜ:/', 'vowel', '长元音', '嘴唇扁平，舌位中', '["bird", "her", "turn", "work"]'),
('/ə/', 'vowel', '短元音', '中性元音，轻读', '["about", "sofa", "banana", "teacher"]'),

-- 双元音 (8个)
('/eɪ/', 'vowel', '双元音', '从/e/滑向/ɪ/', '["day", "make", "rain", "say"]'),
('/aɪ/', 'vowel', '双元音', '从/a/滑向/ɪ/', '["my", "like", "time", "fly"]'),
('/ɔɪ/', 'vowel', '双元音', '从/ɔ/滑向/ɪ/', '["boy", "toy", "coin", "voice"]'),
('/aʊ/', 'vowel', '双元音', '从/a/滑向/ʊ/', '["now", "house", "out", "how"]'),
('/əʊ/', 'vowel', '双元音', '从/ə/滑向/ʊ/', '["go", "home", "know", "show"]'),
('/ɪə/', 'vowel', '双元音', '从/ɪ/滑向/ə/', '["ear", "here", "beer", "dear"]'),
('/eə/', 'vowel', '双元音', '从/e/滑向/ə/', '["air", "hair", "care", "bear"]'),
('/ʊə/', 'vowel', '双元音', '从/ʊ/滑向/ə/', '["poor", "sure", "tour", "pure"]'),

-- 清辅音 (11个)
('/p/', 'consonant', '爆破音', '双唇紧闭，气流冲出', '["pen", "map", "cup", "happy"]'),
('/t/', 'consonant', '爆破音', '舌尖抵上齿龈，气流冲出', '["tea", "cat", "sit", "better"]'),
('/k/', 'consonant', '爆破音', '舌后抵软腭，气流冲出', '["key", "book", "back", "school"]'),
('/f/', 'consonant', '摩擦音', '上齿咬下唇，气流摩擦', '["fish", "leaf", "coffee", "laugh"]'),
('/s/', 'consonant', '摩擦音', '舌尖接近上齿龈，气流摩擦', '["see", "bus", "miss", "city"]'),
('/θ/', 'consonant', '摩擦音', '舌尖放在上下齿之间', '["think", "bath", "three", "mouth"]'),
('/ʃ/', 'consonant', '摩擦音', '舌尖上翘，嘴唇圆', '["she", "fish", "wash", "shop"]'),
('/h/', 'consonant', '摩擦音', '气流从喉咙呼出', '["he", "hat", "hello", "behind"]'),
('/tʃ/', 'consonant', '破擦音', '/t/+/ʃ/组合', '["chair", "teach", "watch", "lunch"]'),
('/tr/', 'consonant', '破擦音', '/t/+/r/组合', '["tree", "train", "try", "country"]'),
('/ts/', 'consonant', '破擦音', '/t/+/s/组合', '["cats", "hats", "students", "its"]'),

-- 浊辅音 (17个)
('/b/', 'consonant', '爆破音', '双唇紧闭，声带振动', '["bed", "cab", "baby", "rub"]'),
('/d/', 'consonant', '爆破音', '舌尖抵上齿龈，声带振动', '["dog", "bad", "red", "middle"]'),
('/g/', 'consonant', '爆破音', '舌后抵软腭，声带振动', '["go", "bag", "big", "egg"]'),
('/v/', 'consonant', '摩擦音', '上齿咬下唇，声带振动', '["very", "love", "have", "five"]'),
('/z/', 'consonant', '摩擦音', '舌尖接近上齿龈，声带振动', '["zoo", "is", "his", "please"]'),
('/ð/', 'consonant', '摩擦音', '舌尖放在上下齿之间，声带振动', '["this", "that", "mother", "with"]'),
('/ʒ/', 'consonant', '摩擦音', '舌尖上翘，声带振动', '["vision", "measure", "usual", "television"]'),
('/dʒ/', 'consonant', '破擦音', '/d/+/ʒ/组合', '["jump", "age", "bridge", "orange"]'),
('/dr/', 'consonant', '破擦音', '/d/+/r/组合', '["drive", "dream", "drop", "hundred"]'),
('/dz/', 'consonant', '破擦音', '/d/+/z/组合', '["beds", "hands", "friends", "cards"]'),
('/m/', 'consonant', '鼻音', '双唇紧闭，气流从鼻腔出', '["man", "come", "home", "summer"]'),
('/n/', 'consonant', '鼻音', '舌尖抵上齿龈，气流从鼻腔出', '["no", "sun", "pen", "dinner"]'),
('/ŋ/', 'consonant', '鼻音', '舌后抵软腭，气流从鼻腔出', '["sing", "long", "bank", "English"]'),
('/l/', 'consonant', '舌侧音', '舌尖抵上齿龈，气流从舌侧出', '["like", "ball", "tell", "hello"]'),
('/r/', 'consonant', '卷舌音', '舌尖上卷，不接触上颚', '["red", "car", "very", "sorry"]'),
('/w/', 'consonant', '半元音', '嘴唇圆，快速滑向元音', '["we", "win", "swim", "quick"]'),
('/j/', 'consonant', '半元音', '舌面抬高，快速滑向元音', '["yes", "you", "year", "new"]');

-- 插入示例课程数据
INSERT INTO lessons (title, lesson_number, phonetics_covered, confusion_pairs, pronunciation_rules, letter_rules) VALUES
('第1课：长短元音 /i:/ 和 /ɪ/', 1, '[1, 2]', 
 '[{"pair": [1, 2], "tips": "/i:/嘴角咧开笑，/ɪ/嘴型放松", "examples": [{"word1": "sheep", "word2": "ship"}, {"word1": "beat", "word2": "bit"}]}]',
 '掌握长短元音的区别，长元音发音时间更长，嘴型更夸张',
 '[{"letter": "ee", "rule": "通常发/i:/", "examples": ["see", "tree", "meet"]}, {"letter": "i", "rule": "在重读闭音节中发/ɪ/", "examples": ["sit", "big", "hit"]}]'),

('第2课：元音 /e/ 和 /æ/', 2, '[3, 4]',
 '[{"pair": [3, 4], "tips": "/æ/嘴巴张得更大，舌位更低", "examples": [{"word1": "bed", "word2": "bad"}, {"word1": "pen", "word2": "pan"}]}]',
 '注意嘴巴张开的程度，/æ/是英语中嘴巴张得最大的元音',
 '[{"letter": "e", "rule": "在重读闭音节中发/e/", "examples": ["bed", "red", "get"]}, {"letter": "a", "rule": "在重读闭音节中发/æ/", "examples": ["cat", "map", "hat"]}]'),

('第3课：爆破音 /p/ /b/ /t/ /d/', 3, '[21, 31, 22, 32]',
 '[{"pair": [21, 31], "tips": "/p/清辅音不振动，/b/浊辅音振动", "examples": [{"word1": "pen", "word2": "ben"}, {"word1": "cup", "word2": "cub"}]}, {"pair": [22, 32], "tips": "/t/清辅音不振动，/d/浊辅音振动", "examples": [{"word1": "ten", "word2": "den"}, {"word1": "bat", "word2": "bad"}]}]',
 '清浊辅音的区别：清辅音声带不振动，浊辅音声带振动。可以用手摸喉咙感受振动',
 '[{"letter": "p", "rule": "发/p/音", "examples": ["pen", "map"]}, {"letter": "b", "rule": "发/b/音", "examples": ["bed", "cab"]}, {"letter": "t", "rule": "发/t/音", "examples": ["tea", "cat"]}, {"letter": "d", "rule": "发/d/音", "examples": ["dog", "bad"]}]');

-- 插入示例练习题
INSERT INTO exercises (lesson_id, question_type, question_text, options, correct_answer, explanation, difficulty) VALUES
(1, 'listen_choose', '听音选词：请选出你听到的单词', '["sheep", "ship"]', 'sheep', 'sheep发/i:/长音，嘴角咧开；ship发/ɪ/短音，嘴型放松', 'easy'),
(1, 'minimal_pair', '最小对立对：选出发音不同的部分', '["beat - bit", "seat - sit", "heat - hit"]', 'i vs ɪ', '这些单词对只有元音不同，/i:/是长音，/ɪ/是短音', 'medium'),
(1, 'word_phonetic', '请选出单词 "meet" 的正确音标', '["/mi:t/", "/mɪt/", "/met/"]', '/mi:t/', 'meet中的ee发长音/i:/', 'easy'),

(2, 'listen_choose', '听音选词：请选出你听到的单词', '["bed", "bad"]', 'bad', 'bad发/æ/，嘴巴张得更大', 'easy'),
(2, 'pair_compare', '比较发音：哪个单词的元音嘴巴张得更大？', '["pen", "pan"]', 'pan', 'pan中的a发/æ/，是英语中嘴巴张得最大的元音', 'medium'),

(3, 'listen_choose', '听音辨别：这是清辅音还是浊辅音？', '["清辅音", "浊辅音"]', '浊辅音', '浊辅音发音时声带振动，可以用手摸喉咙感受', 'medium'),
(3, 'minimal_pair', '选出发音不同的辅音对', '["pen - ben", "tea - tea", "dog - dog"]', 'pen - ben', 'pen的/p/是清辅音，ben的/b/是浊辅音', 'hard');

-- 查询验证
SELECT '音标总数：' as info, COUNT(*) as count FROM phonetics;
SELECT '课程总数：' as info, COUNT(*) as count FROM lessons;
SELECT '练习题总数：' as info, COUNT(*) as count FROM exercises;
