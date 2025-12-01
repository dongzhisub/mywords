import db from '../config/database.js';

const supabase = db.client();

// 获取课程的所有练习题
export const getExercisesByLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;

        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('id');

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 提交练习答案
export const submitExercise = async (req, res) => {
    try {
        const { exerciseId, studentAnswer } = req.body;

        // 获取练习题信息
        const { data: exercise, error } = await supabase
            .from('exercises')
            .select('correct_answer, explanation')
            .eq('id', exerciseId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Exercise not found' });
            }
            throw error;
        }

        // 判断答案是否正确
        const isCorrect = studentAnswer.trim().toLowerCase() ===
            exercise.correct_answer.trim().toLowerCase();

        res.json({
            success: true,
            data: {
                isCorrect,
                correctAnswer: exercise.correct_answer,
                explanation: exercise.explanation
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 批量提交练习题（用于课程结束时）
export const submitExerciseBatch = async (req, res) => {
    try {
        const { lessonId, studentId, answers } = req.body;
        // answers: [{ exerciseId, studentAnswer }]

        const results = await Promise.all(
            answers.map(async ({ exerciseId, studentAnswer }) => {
                const { data: exercise, error } = await supabase
                    .from('exercises')
                    .select('correct_answer, explanation')
                    .eq('id', exerciseId)
                    .single();

                if (error) throw error;

                const isCorrect = studentAnswer.trim().toLowerCase() ===
                    exercise.correct_answer.trim().toLowerCase();

                return {
                    exerciseId,
                    isCorrect,
                    correctAnswer: exercise.correct_answer,
                    explanation: exercise.explanation
                };
            })
        );

        // 计算得分
        const correctCount = results.filter(r => r.isCorrect).length;
        const score = Math.round((correctCount / results.length) * 100);

        res.json({
            success: true,
            data: {
                results,
                score,
                correctCount,
                totalCount: results.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
