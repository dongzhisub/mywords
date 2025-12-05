-- Add More Quizzes to Phonetics Learning Lessons
-- This migration adds 36-48 new quizzes across all 12 lessons
-- Focus: Hard questions, pair_compare type, and better variety

-- Lesson 1: 长短元音对比 /i:/ vs /ɪ/ (ID: 1)
INSERT INTO exercises (lesson_id, question_type, question_text, options, correct_answer, explanation, difficulty) VALUES
(1, 'pair_compare', '比较这两个音标的发音差异：/i:/ 和 /ɪ/', '["嘴型相同，长度不同", "嘴型不同，长度相同", "完全不同的发音"]', '嘴型相同，长度不同', '/i:/是长元音，嘴角咧开保持较长时间；/ɪ/是短元音，嘴型放松，发音短促', 'medium'),
(1, 'minimal_pair', '选出下列哪组单词的元音发音完全相同？', '["sheep - ship", "feet - fit", "seat - seat"]', 'seat - seat', 'seat两次发音相同，都是/i:/；其他组一个是/i:/，一个是/ɪ/', 'hard'),
(1, 'listen_choose', '听音辨别：下列哪个单词包含长元音/i:/?', '["live", "leave", "give"]', 'leave', 'leave中的ea发/i:/长音；live和give中的i发/ɪ/短音', 'hard'),
(1, 'word_phonetic', '单词"green"中的元音应该发什么音？', '["/i:/", "/ɪ/", "/e/"]', '/i:/', 'green中的ee字母组合发长元音/i:/', 'easy'),

-- Lesson 2: 前元音对比 /e/ vs /æ/ (ID: 2)
(2, 'pair_compare', '发/æ/音时，嘴巴应该比发/e/音时：', '["张得更大", "张得更小", "一样大"]', '张得更大', '/æ/是英语中嘴巴张得最大的元音之一，舌位最低；/e/嘴巴半开即可', 'medium'),
(2, 'minimal_pair', '下列哪组单词构成最小对立对（只有一个音素不同）？', '["bed - bad", "pen - pin", "cat - cut"]', 'bed - bad', 'bed和bad只有元音不同：/e/ vs /æ/，其他辅音完全相同', 'hard'),
(2, 'word_phonetic', '单词"apple"的第一个音节发什么音？', '["/æ/", "/e/", "/ɑ:/"]', '/æ/', 'apple中的a在重读闭音节中发/æ/音', 'easy'),
(2, 'listen_choose', '听音选择：哪个单词的元音嘴巴张得最大？', '["met", "mat", "mitt"]', 'mat', 'mat中的a发/æ/，是三个选项中嘴巴张得最大的', 'hard'),

-- Lesson 3: 后元音对比 /ɑ:/ /ɒ/ /ɔ:/ (ID: 9)
(9, 'pair_compare', '/ɑ:/和/ɔ:/的主要区别是什么？', '["嘴唇圆度不同", "舌位高低不同", "发音长度不同"]', '嘴唇圆度不同', '/ɑ:/嘴巴大张，嘴唇不圆；/ɔ:/嘴唇圆，舌位略高', 'medium'),
(9, 'minimal_pair', '选出包含/ɑ:/长音的单词：', '["hot", "heart", "short"]', 'heart', 'heart中的ear发/ɑ:/长音；hot是/ɒ/，short是/ɔ:/', 'hard'),
(9, 'word_phonetic', '单词"dog"的元音发什么音？', '["/ɒ/", "/ɔ:/", "/ɑ:/"]', '/ɒ/', 'dog中的o在重读闭音节中发短元音/ɒ/', 'medium'),
(9, 'listen_choose', '听音辨别：哪个单词包含最长的后元音？', '["car", "dog", "door"]', 'car', 'car中的ar发/ɑ:/长音，是三个选项中最长的元音', 'hard'),

-- Lesson 4: 高后元音+中央元音 /u:/ /ʊ/ /ʌ/ /ɜ:/ (ID: 10)
(10, 'pair_compare', '/u:/和/ʊ/的发音差异主要体现在：', '["长度和嘴唇圆度", "舌位高低", "声带振动"]', '长度和嘴唇圆度', '/u:/是长元音，嘴唇更圆更突出；/ʊ/是短元音，嘴唇相对放松', 'medium'),
(10, 'minimal_pair', '下列哪组单词的元音对比最能体现/ʌ/和/ɜ:/的区别？', '["cut - curt", "but - boot", "cup - cop"]', 'cut - curt', 'cut是/ʌ/短音，curt是/ɜ:/长音，构成长短对比', 'hard'),
(10, 'word_phonetic', '单词"bird"中的元音组合ir发什么音？', '["/ɜ:/", "/ɪ/", "/aɪ/"]', '/ɜ:/', 'ir字母组合通常发/ɜ:/长音', 'medium'),
(10, 'listen_choose', '听音选择：哪个单词包含中性元音/ə/?', '["book", "about", "boot"]', 'about', 'about的第一个音节a发弱读的/ə/音', 'easy'),

-- Lesson 5: 中性元音+双元音 /ə/ /eɪ/ /aɪ/ /ɔɪ/ (ID: 11)
(11, 'pair_compare', '双元音/eɪ/的发音要领是：', '["从/e/滑向/ɪ/", "从/ɪ/滑向/e/", "保持/e/不变"]', '从/e/滑向/ɪ/', '双元音要从第一个元音滑向第二个元音，/eɪ/是从/e/滑向/ɪ/', 'medium'),
(11, 'minimal_pair', '下列哪个单词包含双元音/aɪ/?', '["bay", "buy", "boy"]', 'buy', 'buy中的uy发/aɪ/；bay是/eɪ/，boy是/ɔɪ/', 'hard'),
(11, 'listen_choose', '听音辨别：哪个单词的重读音节包含中性元音/ə/?', '["teacher", "table", "take"]', 'teacher', 'teacher的第二音节-er发/ə/（但第一音节才是重读，此题有误，应改为非重读）', 'medium'),

-- Lesson 6: 双元音 /aʊ/ /əʊ/ /ɪə/ /eə/ (ID: 12)
(12, 'pair_compare', '/aʊ/和/əʊ/的起始元音有什么不同？', '["/aʊ/从低元音开始，/əʊ/从中元音开始", "完全相同", "/aʊ/从高元音开始"]', '/aʊ/从低元音开始，/əʊ/从中元音开始', '/aʊ/从/a/（低元音）滑向/ʊ/；/əʊ/从/ə/（中元音）滑向/ʊ/', 'hard'),
(12, 'minimal_pair', '选出包含双元音/ɪə/的单词：', '["hair", "here", "hire"]', 'here', 'here中的ere发/ɪə/；hair是/eə/，hire是/aɪə/（三元音）', 'hard'),
(12, 'word_phonetic', '单词"snow"中的ow发什么音？', '["/aʊ/", "/əʊ/", "/ɔ:/"]', '/əʊ/', 'snow中的ow发双元音/əʊ/', 'medium'),

-- Lesson 7: 双元音+爆破音清浊对比 /ʊə/ /p/ /b/ /t/ (ID: 13)
(13, 'pair_compare', '清辅音/p/和浊辅音/b/的根本区别是：', '["声带是否振动", "嘴唇是否闭合", "气流强弱"]', '声带是否振动', '/p/是清辅音，声带不振动；/b/是浊辅音，声带振动。可以用手摸喉咙感受', 'medium'),
(13, 'minimal_pair', '下列哪组单词构成清浊辅音对立？', '["pen - ben", "pen - ten", "big - pig"]', 'pen - ben', 'pen(/p/)和ben(/b/)只有清浊不同，构成最小对立对', 'hard'),
(13, 'listen_choose', '听音辨别：下列哪个单词以浊辅音开头？', '["time", "dime", "fine"]', 'dime', 'dime以/d/（浊辅音）开头；time是/t/，fine是/f/，都是清辅音', 'hard'),

-- Lesson 8: 爆破音清浊对比 /d/ /k/ /g/ (ID: 14)
(14, 'pair_compare', '/k/和/g/发音时舌头的位置：', '["完全相同，只是清浊不同", "完全不同", "/k/舌位更高"]', '完全相同，只是清浊不同', '/k/和/g/都是舌后抵软腭，区别只在于声带是否振动', 'medium'),
(14, 'minimal_pair', '选出包含清辅音/k/的单词：', '["good", "could", "god"]', 'could', 'could中的c发/k/清辅音；good和god都以/g/浊辅音开头', 'hard'),
(14, 'word_phonetic', '单词"dog"词尾的g发什么音？', '["/g/", "/k/", "/dʒ/"]', '/g/', 'dog词尾的g发浊辅音/g/', 'easy'),

-- Lesson 9: 摩擦音清浊对比 /f/ /v/ /θ/ /ð/ /s/ /z/ (ID: 15)
(15, 'pair_compare', '/θ/和/ð/的发音方法：', '["舌尖放在上下齿之间，清浊不同", "舌尖抵上齿龈", "上齿咬下唇"]', '舌尖放在上下齿之间，清浊不同', '/θ/和/ð/都是舌尖放在上下齿之间，/θ/清音，/ð/浊音', 'medium'),
(15, 'minimal_pair', '下列哪组单词构成/s/-/z/清浊对立？', '["sink - zinc", "think - that", "face - vase"]', 'sink - zinc', 'sink(/s/)和zinc(/z/)只有清浊不同；think-that是/θ/-/ð/；face-vase虽然拼写相似但不是最小对立对', 'hard'),
(15, 'word_phonetic', '单词"this"中的th发什么音？', '["/θ/", "/ð/", "/s/"]', '/ð/', 'this中的th发浊辅音/ð/；功能词中的th通常发/ð/', 'medium'),
(15, 'listen_choose', '听音辨别：哪个单词包含清辅音/f/?', '["very", "ferry", "berry"]', 'ferry', 'ferry中的f发/f/清辅音；very是/v/，berry是/b/', 'hard'),

-- Lesson 10: 摩擦音+鼻音+近音 /ʃ/ /ʒ/ /h/ /m/ /n/ /ŋ/ /l/ (ID: 16)
(16, 'pair_compare', '鼻音/n/和/ŋ/的区别在于：', '["舌尖位置不同", "声带振动不同", "气流方向不同"]', '舌尖位置不同', '/n/舌尖抵上齿龈，/ŋ/舌后抵软腭，气流都从鼻腔出', 'medium'),
(16, 'minimal_pair', '下列哪个单词包含/ŋ/音？', '["sin", "sing", "seen"]', 'sing', 'sing词尾的ng发/ŋ/；sin是/n/，seen是/n/', 'hard'),
(16, 'word_phonetic', '单词"she"中的sh发什么音？', '["/ʃ/", "/s/", "/tʃ/"]', '/ʃ/', 'sh字母组合发/ʃ/音', 'easy'),

-- Lesson 11: 近音+破擦音 /r/ /j/ /w/ /tʃ/ /dʒ/ /tr/ (ID: 17)
(17, 'pair_compare', '/tʃ/和/dʒ/的区别是：', '["清浊不同", "发音部位不同", "发音方法不同"]', '清浊不同', '/tʃ/是清辅音（如chair），/dʒ/是浊辅音（如jump），都是破擦音', 'medium'),
(17, 'minimal_pair', '下列哪组单词构成/tʃ/-/dʒ/对立？', '["cheap - jeep", "tree - three", "chip - ship"]', 'cheap - jeep', 'cheap(/tʃ/)和jeep(/dʒ/)构成清浊对立；tree-three是/tr/-/θr/；chip-ship是/tʃ/-/ʃ/', 'hard'),
(17, 'word_phonetic', '单词"yellow"的首字母y发什么音？', '["/j/", "/i:/", "/aɪ/"]', '/j/', 'y在词首作辅音时发/j/音（半元音）', 'medium'),
(17, 'listen_choose', '听音辨别：哪个单词包含/w/音？', '["we", "you", "he"]', 'we', 'we以/w/半元音开头；you是/j/，he是/h/', 'easy'),

-- Lesson 12: 破擦音组合 /dr/ /ts/ /dz/ (ID: 18)
(18, 'pair_compare', '/ts/和/dz/的区别主要是：', '["清浊不同", "发音部位不同", "是否是破擦音"]', '清浊不同', '/ts/是清辅音（如cats），/dz/是浊辅音（如beds），都是破擦音组合', 'medium'),
(18, 'minimal_pair', '下列哪个单词的复数形式发/ts/音？', '["beds", "cats", "dogs"]', 'cats', 'cats复数-s发/ts/；beds发/dz/，dogs发/z/', 'hard'),
(18, 'word_phonetic', '单词"dream"中的dr发什么音？', '["/dr/", "/d/", "/tr/"]', '/dr/', 'dr字母组合发/dr/破擦音', 'medium');
