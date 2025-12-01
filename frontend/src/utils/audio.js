export const playAudio = (text, rate = 0.8) => {
    if (!text) return;

    // 取消当前正在播放的音频
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // 针对音标符号的特殊处理
    // 如果文本看起来像音标（包含/或[]），尝试发音其代表词或忽略
    // 这里我们假设传入的 text 主要是单词。
    // 如果是音标符号，TTS通常读不准，所以调用者应该尽量传入代表词。

    window.speechSynthesis.speak(utterance);
};
