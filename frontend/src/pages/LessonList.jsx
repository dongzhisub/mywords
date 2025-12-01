import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './LessonList.css';

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadLessons();
    }, []);

    const loadLessons = async () => {
        try {
            setLoading(true);
            const response = await api.lessons.getAll();
            if (response.success) {
                setLessons(response.data);
            } else {
                setError('加载课程失败');
            }
        } catch (err) {
            setError('网络错误: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error-message">
                    <p>⚠️ {error}</p>
                    <button className="btn btn-primary" onClick={loadLessons}>
                        重试
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container lesson-list-page fade-in">
            <div className="page-header">
                <h1>📚 音标学习课程</h1>
                <p className="subtitle">每节课8分钟,轻松掌握英语音标</p>
            </div>

            <div className="lessons-grid">
                {lessons.map((lesson) => (
                    <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        className="lesson-card"
                    >
                        <div className="lesson-number">
                            <span>第 {lesson.lesson_number} 课</span>
                        </div>

                        <h3 className="lesson-title">{lesson.title}</h3>

                        <div className="lesson-meta">
                            <div className="meta-item">
                                <span className="icon">⏱️</span>
                                <span>{lesson.duration / 60} 分钟</span>
                            </div>
                            <div className="meta-item">
                                <span className="icon">🎯</span>
                                <span>{Array.isArray(lesson.phonetics_covered) ? lesson.phonetics_covered.length : JSON.parse(lesson.phonetics_covered || '[]').length} 个音标</span>
                            </div>
                        </div>

                        <div className="lesson-footer">
                            <span className="start-btn">开始学习 →</span>
                        </div>
                    </Link>
                ))}
            </div>

            {lessons.length === 0 && (
                <div className="empty-state">
                    <p>暂无课程</p>
                </div>
            )}
        </div>
    );
}

export default LessonList;
