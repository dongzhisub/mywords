// IPA 音标符号到 Wikimedia Commons 音频文件的映射
// 基于标准 IPA 命名规则

export const ipaAudioMapping = {
    // 元音 - Vowels
    '/i:/': 'Close_front_unrounded_vowel.ogg',  // 已完成
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
    '/ə/': 'Mid-central_vowel.ogg',

    // 双元音 - Diphthongs (使用第一个元音的音频作为近似)
    '/eɪ/': 'Close-mid_front_unrounded_vowel.ogg',
    '/aɪ/': 'Open_front_unrounded_vowel.ogg',
    '/ɔɪ/': 'Open-mid_back_rounded_vowel.ogg',
    '/aʊ/': 'Open_front_unrounded_vowel.ogg',
    '/əʊ/': 'Mid-central_vowel.ogg',
    '/ɪə/': 'Near-close_near-front_unrounded_vowel.ogg',
    '/eə/': 'Close-mid_front_unrounded_vowel.ogg',
    '/ʊə/': 'Near-close_near-back_rounded_vowel.ogg',

    // 辅音 - Consonants
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

    // 破擦音 - Affricates (组合音，使用第一个音素)
    '/tʃ/': 'Voiceless_palato-alveolar_affricate.ogg',
    '/dʒ/': 'Voiced_palato-alveolar_affricate.ogg',
    '/tr/': 'Voiceless_alveolar_plosive.ogg',  // 使用 /t/ 的音频
    '/dr/': 'Voiced_alveolar_plosive.ogg',     // 使用 /d/ 的音频
    '/ts/': 'Voiceless_alveolar_plosive.ogg',  // 使用 /t/ 的音频
    '/dz/': 'Voiced_alveolar_plosive.ogg'      // 使用 /d/ 的音频
};

// 计算 Wikimedia Commons 的 MD5 路径
export function getWikimediaUrl(filename) {
    // 注意：这个函数需要 crypto 模块来计算 MD5
    // 在实际使用时需要动态计算或使用预先计算好的映射
    return `https://upload.wikimedia.org/wikipedia/commons/[hash]/${filename}`;
}
