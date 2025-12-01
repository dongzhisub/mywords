import db from '../config/database.js';

const supabase = db.client();

// 获取学生进度
export const getStudentProgress = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // 获取进度数据(关联课程信息)
        const { data: progress, error: progressError } = await supabase
            .from('student_progress')
            .select(`
        *,
        lessons (
          title,
          lesson_number
        )
      `)
            .eq('student_id', studentId)
            .order('lessons(lesson_number)');

        if (progressError) throw progressError;

        // 获取课程总数
        const { count: totalLessons, error: countError } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // 统计数据
        const completedLessons = progress.filter(p => p.completed).length;
        const averageScore = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
            : 0;
        const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0);

        res.json({
            success: true,
            data: {
                progress,
                stats: {
                    totalLessons,
                    completedLessons,
                    averageScore,
                    totalTimeSpent
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 更新学习进度
export const updateProgress = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const { lessonId, completed, score, timeSpent } = req.body;

        // 检查是否已存在记录
        const { data: existing, error: checkError } = await supabase
            .from('student_progress')
            .select('id')
            .eq('student_id', studentId)
            .eq('lesson_id', lessonId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existing) {
            // 更新现有记录
            const { error: updateError } = await supabase
                .from('student_progress')
                .update({
                    completed,
                    score,
                    time_spent: timeSpent,
                    completed_at: new Date().toISOString()
                })
                .eq('student_id', studentId)
                .eq('lesson_id', lessonId);

            if (updateError) throw updateError;
        } else {
            // 插入新记录
            const { error: insertError } = await supabase
                .from('student_progress')
                .insert({
                    student_id: studentId,
                    lesson_id: lessonId,
                    completed,
                    score,
                    time_spent: timeSpent,
                    completed_at: new Date().toISOString()
                });

            if (insertError) throw insertError;
        }

        res.json({ success: true, message: 'Progress updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 获取学生某个课程的进度
export const getLessonProgress = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const { lessonId } = req.params;

        const { data, error } = await supabase
            .from('student_progress')
            .select(`
        *,
        lessons (
          title,
          lesson_number
        )
      `)
            .eq('student_id', studentId)
            .eq('lesson_id', lessonId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.json({ success: true, data: null });
            }
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
