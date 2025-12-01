import { useState } from 'react';
import { api } from '../services/api';
import './ExerciseSection.css';

function ExerciseSection({ exercises, lessonId, studentId, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);

    const currentExercise = exercises[currentIndex];
    const options = currentExercise
        ? (Array.isArray(currentExercise.options) ? currentExercise.options : JSON.parse(currentExercise.options))
        : [];

    const handleAnswer = (answer) => {
        setAnswers({
            ...answers,
            [currentExercise.id]: answer
        });
    };

    const handleNext = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitAllAnswers();
        }
    };

    const submitAllAnswers = async () => {
        const answersArray = exercises.map(ex => ({
            exerciseId: ex.id,
            studentAnswer: answers[ex.id] || ''
        }));

        try {
            const response = await api.exercises.submitBatch({
                lessonId,
                studentId,
                answers: answersArray
            });

            if (response.success) {
                setResults(response.data);
                setShowResults(true);
            }
        } catch (err) {
            console.error('提交答案失败:', err);
        }
    };

    const handleFinish = () => {
        if (results) {
            onComplete(results.score);
        }
    };

    if (showResults && results) {
        return (
            <div className="exercise-results fade-in">
                <div className="results-header">
                    <div className="score-circle">
                        <div className="score-number">{results.score}</div>
                        <div className="score-label">分</div>
                    </div>
                    <h3>练习完成!</h3>
                    <p>正确 {results.correctCount} / {results.totalCount} 题</p>
                </div>

                <div className="results-details">
                    {results.results.map((result, index) => (
                        <div
                            key={index}
                            className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
                        >
                            <div className="result-header">
                                <span className="result-icon">
                                    {result.isCorrect ? '✅' : '❌'}
                                </span>
                                <span className="result-title">第 {index + 1} 题</span>
                            </div>
                            {!result.isCorrect && (
                                <div className="result-info">
                                    <p className="correct-answer">
                                        正确答案: <strong>{result.correctAnswer}</strong>
                                    </p>
                                    <p className="explanation">{result.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary finish-btn" onClick={handleFinish}>
                    完成课程 🎉
                </button>
            </div>
        );
    }

    if (!currentExercise) {
        return <div>暂无练习题</div>;
    }

    return (
        <div className="exercise-section fade-in">
            <div className="exercise-progress">
                <div className="progress-text">
                    题目 {currentIndex + 1} / {exercises.length}
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="exercise-card">
                <div className="question-type-badge">
                    {currentExercise.question_type === 'listen_choose' && '听音选择'}
                    {currentExercise.question_type === 'pair_compare' && '对比题'}
                    {currentExercise.question_type === 'word_phonetic' && '音标标注'}
                    {currentExercise.question_type === 'minimal_pair' && '最小对立对'}
                </div>

                <h3 className="question-text">{currentExercise.question_text}</h3>

                <div className="options-list">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-btn ${answers[currentExercise.id] === option ? 'selected' : ''}`}
                            onClick={() => handleAnswer(option)}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                        </button>
                    ))}
                </div>

                <button
                    className="btn btn-primary next-question-btn"
                    onClick={handleNext}
                    disabled={!answers[currentExercise.id]}
                >
                    {currentIndex < exercises.length - 1 ? '下一题 →' : '提交答案'}
                </button>
            </div>
        </div>
    );
}

export default ExerciseSection;
