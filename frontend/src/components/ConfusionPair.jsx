import { useState } from 'react';
import { playAudio } from '../utils/audio';
import './ConfusionPair.css';

function ConfusionPair({ pair }) {
    const [playingIndex, setPlayingIndex] = useState(null);

    const playComparison = (phonetic, index) => {
        const exampleWords = phonetic.example_words
            ? (Array.isArray(phonetic.example_words) ? phonetic.example_words : JSON.parse(phonetic.example_words))
            : [];

        if (exampleWords.length > 0) {
            setPlayingIndex(index);
            playAudio(exampleWords[0]);
            setTimeout(() => setPlayingIndex(null), 1000);
        } else {
            // Fallback to symbol if no words
            setPlayingIndex(index);
            playAudio(phonetic.symbol);
            setTimeout(() => setPlayingIndex(null), 1000);
        }
    };

    // Parse examples from string format "word1-word2" to {word1, word2}
    const examples = (pair.examples || []).map(ex => {
        if (typeof ex === 'string') {
            const [word1, word2] = ex.split('-');
            return { word1, word2 };
        }
        return ex; // Already in object format
    });

    // Defensive check for missing phonetic data
    if (!pair.phonetic1 || !pair.phonetic2) {
        console.error('ConfusionPair: Missing phonetic data', pair);
        return null;
    }

    return (
        <div className="confusion-pair">
            <div className="pair-header">
                <h3>对比学习</h3>
                <p className="difference">{pair.difference}</p>
            </div>

            <div className="pair-comparison">
                {/* 左侧音标 */}
                <div className="phonetic-side">
                    <div className="phonetic-symbol-large">{pair.phonetic1.symbol}</div>
                    <button
                        className={`compare-play-btn ${playingIndex === 0 ? 'playing' : ''}`}
                        onClick={() => playComparison(pair.phonetic1, 0)}
                    >
                        🔊 播放发音
                    </button>
                    <div className="phonetic-info">
                        <p>{pair.phonetic1.description}</p>
                    </div>
                </div>

                <div className="vs-divider">
                    <span>VS</span>
                </div>

                {/* 右侧音标 */}
                <div className="phonetic-side">
                    <div className="phonetic-symbol-large">{pair.phonetic2.symbol}</div>
                    <button
                        className={`compare-play-btn ${playingIndex === 1 ? 'playing' : ''}`}
                        onClick={() => playComparison(pair.phonetic2, 1)}
                    >
                        🔊 播放发音
                    </button>
                    <div className="phonetic-info">
                        <p>{pair.phonetic2.description}</p>
                    </div>
                </div>
            </div>

            {/* 示例单词对比 */}
            {
                examples.length > 0 && (
                    <div className="examples-comparison">
                        <h4>示例单词对比 (点击播放)</h4>
                        <div className="examples-grid">
                            {examples.map((example, index) => (
                                <div key={index} className="example-pair">
                                    <div
                                        className="example-item clickable"
                                        onClick={() => playAudio(example.word1)}
                                        title="点击播放"
                                    >
                                        <span className="example-word">{example.word1}</span>
                                        <span className="example-phonetic">{pair.phonetic1.symbol}</span>
                                        <span className="audio-icon">🔊</span>
                                    </div>
                                    <div className="example-divider">↔️</div>
                                    <div
                                        className="example-item clickable"
                                        onClick={() => playAudio(example.word2)}
                                        title="点击播放"
                                    >
                                        <span className="example-word">{example.word2}</span>
                                        <span className="example-phonetic">{pair.phonetic2.symbol}</span>
                                        <span className="audio-icon">🔊</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default ConfusionPair;
