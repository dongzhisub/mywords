import db from '../config/database.js';

const supabase = db.client();

// 获取所有课程
export const getAllLessons = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .order('lesson_number');

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 获取单个课程详情
export const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Lesson not found' });
            }
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 获取课程相关的音标详情
export const getLessonPhonetics = async (req, res) => {
    try {
        const { id } = req.params;

        // 获取课程信息
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('phonetics_covered')
            .eq('id', id)
            .single();

        if (lessonError) {
            if (lessonError.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Lesson not found' });
            }
            throw lessonError;
        }

        // 解析音标ID数组
        const phoneticIds = lesson.phonetics_covered;

        if (!phoneticIds || phoneticIds.length === 0) {
            return res.json({ success: true, data: [] });
        }

        // 获取音标详情
        const { data: phonetics, error: phoneticsError } = await supabase
            .from('phonetics')
            .select('*')
            .in('id', phoneticIds);

        if (phoneticsError) throw phoneticsError;

        res.json({ success: true, data: phonetics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 获取课程的易混淆音标对详情
export const getLessonConfusionPairs = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('confusion_pairs')
            .eq('id', id)
            .single();

        if (lessonError) {
            if (lessonError.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Lesson not found' });
            }
            throw lessonError;
        }

        const confusionPairs = lesson.confusion_pairs || [];

        if (confusionPairs.length === 0) {
            return res.json({ success: true, data: [] });
        }

        // 获取每对音标的详细信息
        const detailedPairs = await Promise.all(
            confusionPairs.map(async (pair) => {
                const { data: phonetics, error } = await supabase
                    .from('phonetics')
                    .select('*')
                    .in('id', [pair.phonetic1_id, pair.phonetic2_id]);

                if (error) throw error;

                return {
                    ...pair,
                    phonetic1: phonetics.find(p => p.id === pair.phonetic1_id),
                    phonetic2: phonetics.find(p => p.id === pair.phonetic2_id)
                };
            })
        );

        res.json({ success: true, data: detailedPairs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

