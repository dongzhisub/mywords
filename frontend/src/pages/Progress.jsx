import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './Progress.css';

const DEMO_STUDENT_ID = 'demo-student';

function Progress() {
    const { studentId } = useParams();
    const actualStudentId = studentId || DEMO_STUDENT_ID;
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, [actualStudentId]);

    const loadProgress = async () => {
        try {
            setLoading(true);
            const response = await api.progress.getStudent(actualStudentId);
            if (response.success) {
                setProgressData(response.data);
            }
        } catch (err) {
            console.error('加载进度失败:', err);
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

    if (!progressData) {
        return <div className="container">无法加载进度数据</div>;
    }

    const { progress, stats } = progressData;
    const completionRate = stats.totalLessons > 0
        ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
        : 0;

    return (
        <div className="container progress-page fade-in">
            <div className="page-header">
                <h1>📊 我的学习进度</h1>
                <Link to="/" className="btn btn-secondary">
                    返回课程列表
                </Link>
            </div>

            {/* 统计卡片 */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.completedLessons}</div>
                        <div className="stat-label">已完成课程</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <div className="stat-value">{completionRate}%</div>
                        <div className="stat-label">完成率</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.averageScore}</div>
                        <div className="stat-label">平均分数</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <div className="stat-value">{Math.floor(stats.totalTimeSpent / 60)}</div>
                        <div className="stat-label">学习分钟数</div>
                    </div>
                </div>
            </div>

            {/* 课程进度列表 */}
            <div className="progress-list">
                <h2>课程详情</h2>
                {progress.length === 0 ? (
                    <div className="empty-state">
                        <p>还没有开始学习哦,快去选择一节课程吧!</p>
                        <Link to="/" className="btn btn-primary">
                            开始学习
                        </Link>
                    </div>
                ) : (
                    <div className="progress-items">
                        {progress.map((item) => (
                            <div key={item.id} className="progress-item">
                                <div className="progress-item-header">
                                    <div className="lesson-info">
                                        <span className="lesson-number">第 {item.lesson_number} 课</span>
                                        <h3>{item.title}</h3>
                                    </div>
                                    <div className="status-badge">
                                        {item.completed ? (
                                            <span className="badge badge-success">✓ 已完成</span>
                                        ) : (
                                            <span className="badge badge-warning">进行中</span>
                                        )}
                                    </div>
                                </div>

                                {item.completed && (
                                    <div className="progress-item-details">
                                        <div className="detail-item">
                                            <span className="detail-label">得分:</span>
                                            <span className="detail-value score">{item.score} 分</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">用时:</span>
                                            <span className="detail-value">
                                                {Math.floor(item.time_spent / 60)} 分钟
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">完成时间:</span>
                                            <span className="detail-value">
                                                {new Date(item.completed_at).toLocaleDateString('zh-CN')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Progress;
