import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { playAudio } from '../utils/audio';
import PhoneticCard from '../components/PhoneticCard';
import ConfusionPair from '../components/ConfusionPair';
import ExerciseSection from '../components/ExerciseSection';
import './LessonDetail.css';

const DEMO_STUDENT_ID = 'demo-student';

function LessonDetail() {
    const studentId = DEMO_STUDENT_ID;
    const { id } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [phonetics, setPhonetics] = useState([]);
    const [confusionPairs, setConfusionPairs] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(1); // 1-4对应4个部分
    const [startTime] = useState(Date.now());

    useEffect(() => {
        loadLessonData();
    }, [id]);

    const loadLessonData = async () => {
        try {
            setLoading(true);
            const [lessonRes, phoneticsRes, pairsRes, exercisesRes] = await Promise.all([
                api.lessons.getById(id),
                api.lessons.getPhonetics(id),
                api.lessons.getConfusionPairs(id),
                api.exercises.getByLesson(id)
            ]);

            if (lessonRes.success) setLesson(lessonRes.data);
            if (phoneticsRes.success) setPhonetics(phoneticsRes.data);
            if (pairsRes.success) setConfusionPairs(pairsRes.data);
            if (exercisesRes.success) setExercises(exercisesRes.data);
        } catch (err) {
            console.error('加载课程数据失败:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteLesson = async (score) => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        try {
            await api.progress.update(studentId, {
                lessonId: id,
                completed: true,
                score,
                timeSpent
            });

            navigate('/');
        } catch (err) {
            console.error('保存进度失败:', err);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="container">
                <p>课程未找到</p>
            </div>
        );
    }

    const letterRules = lesson.letter_rules
        ? (Array.isArray(lesson.letter_rules) ? lesson.letter_rules : JSON.parse(lesson.letter_rules))
        : [];

    return (
        <div className="lesson-detail-page">
            <div className="container">
                {/* 课程头部 */}
                <div className="lesson-header fade-in">
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>
                        ← 返回课程列表
                    </button>
                    <h1>{lesson.title}</h1>
                    <div className="lesson-progress-bar">
                        <div className="progress-steps">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`progress-step ${currentSection >= step ? 'active' : ''}`}
                                >
                                    <div className="step-number">{step}</div>
                                    <div className="step-label">
                                        {step === 1 && '音标介绍'}
                                        {step === 2 && '易混淆对比'}
                                        {step === 3 && '发音规律'}
                                        {step === 4 && '快速练习'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Part 1: 音标介绍 */}
                {currentSection === 1 && (
                    <div className="section fade-in">
                        <div className="section-header">
                            <h2>📖 Part 1: 音标介绍</h2>
                            <span className="time-badge">⏱️ 约2分钟</span>
                        </div>

                        <div className="phonetics-grid">
                            {phonetics.map((phonetic) => (
                                <PhoneticCard key={phonetic.id} phonetic={phonetic} />
                            ))}
                        </div>

                        <button
                            className="btn btn-primary next-btn"
                            onClick={() => setCurrentSection(2)}
                        >
                            下一步: 易混淆对比 →
                        </button>
                    </div>
                )}

                {/* Part 2: 易混淆对比 */}
                {currentSection === 2 && (
                    <div className="section fade-in">
                        <div className="section-header">
                            <h2>🔄 Part 2: 易混淆音标对比</h2>
                            <span className="time-badge">⏱️ 约3分钟</span>
                        </div>

                        {confusionPairs.map((pair, index) => (
                            <ConfusionPair key={index} pair={pair} />
                        ))}

                        <div className="section-nav">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setCurrentSection(1)}
                            >
                                ← 上一步
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentSection(3)}
                            >
                                下一步: 发音规律 →
                            </button>
                        </div>
                    </div>
                )}

                {/* Part 3: 发音规律总结 */}
                {currentSection === 3 && (
                    <div className="section fade-in">
                        <div className="section-header">
                            <h2>📝 Part 3: 字母发音规律</h2>
                            <span className="time-badge">⏱️ 约2分钟</span>
                        </div>

                        <div className="rules-section">
                            <div className="rules-intro">
                                <p>{lesson.pronunciation_rules}</p>
                            </div>

                            <div className="letter-rules-grid">
                                {letterRules.map((rule, index) => (
                                    <div key={index} className="rule-card">
                                        <div className="rule-letter">{rule.letter}</div>
                                        <div className="rule-content">
                                            <p className="rule-text">{rule.rule}</p>

                                            <div className="rule-examples">
                                                {rule.examples.map((example, i) => (
                                                    <span
                                                        key={i}
                                                        className="example-word clickable"
                                                        onClick={() => playAudio(example)}
                                                        title="点击播放"
                                                    >
                                                        {example} 🔊
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section-nav">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setCurrentSection(2)}
                            >
                                ← 上一步
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentSection(4)}
                            >
                                下一步: 快速练习 →
                            </button>
                        </div>
                    </div>
                )}

                {/* Part 4: 快速练习 */}
                {currentSection === 4 && (
                    <div className="section fade-in">
                        <div className="section-header">
                            <h2>✏️ Part 4: 快速练习</h2>
                            <span className="time-badge">⏱️ 约1分钟</span>
                        </div>

                        <ExerciseSection
                            exercises={exercises}
                            lessonId={id}
                            studentId={studentId}
                            onComplete={handleCompleteLesson}
                        />

                        <button
                            className="btn btn-secondary"
                            onClick={() => setCurrentSection(3)}
                        >
                            ← 上一步
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LessonDetail;
