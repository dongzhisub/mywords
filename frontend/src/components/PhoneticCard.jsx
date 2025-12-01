import { useState } from 'react';
import { playAudio } from '../utils/audio';
import './PhoneticCard.css';

function PhoneticCard({ phonetic }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const exampleWords = phonetic.example_words
        ? (Array.isArray(phonetic.example_words) ? phonetic.example_words : JSON.parse(phonetic.example_words))
        : [];

    const handlePlayAudio = () => {
        if (phonetic.audio_url) {
            const audio = new Audio(phonetic.audio_url);
            setIsPlaying(true);
            audio.play();
            audio.onended = () => setIsPlaying(false);
        } else {
            // 使用Web Speech API作为备选
            // 优先播放第一个示例单词，因为TTS读音标符号可能不准
            const textToSpeak = exampleWords[0] || phonetic.symbol;
            setIsPlaying(true);

            // 使用我们封装的工具
            playAudio(textToSpeak);

            // 简单的延时模拟播放状态结束
            setTimeout(() => setIsPlaying(false), 1000);
        }
    };

    return (
        <div className="phonetic-card">
            <div className="phonetic-symbol">{phonetic.symbol}</div>

            <div className="phonetic-type">
                <span className={`type-badge ${phonetic.type}`}>
                    {phonetic.type === 'vowel' ? '元音' : '辅音'}
                </span>
                <span className="category-badge">{phonetic.category}</span>
            </div>

            {phonetic.mouth_shape_image && (
                <div className="mouth-shape">
                    <img src={phonetic.mouth_shape_image} alt={`${phonetic.symbol} 口型`} />
                </div>
            )}

            {phonetic.video_url && (
                <div className="video-container">
                    <video controls>
                        <source src={phonetic.video_url} type="video/mp4" />
                        您的浏览器不支持视频播放
                    </video>
                </div>
            )}

            <button
                className={`play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={handlePlayAudio}
            >
                <span className="icon">{isPlaying ? '🔊' : '🔉'}</span>
                <span>{isPlaying ? '播放中...' : '点击发音'}</span>
            </button>

            <div className="phonetic-description">
                <p>{phonetic.description}</p>
            </div>

            <div className="example-words">
                <div className="examples-label">示例单词 (点击发音):</div>
                <div className="words-list">
                    {exampleWords.map((word, index) => (
                        <span
                            key={index}
                            className="word-chip clickable"
                            onClick={() => playAudio(word)}
                            title="点击播放"
                        >
                            {word} 🔊
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PhoneticCard;
