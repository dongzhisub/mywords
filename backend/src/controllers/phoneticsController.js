import db from '../config/database.js';

const supabase = db.client();

// 获取所有音标
export const getAllPhonetics = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('phonetics')
            .select('*')
            .order('type')
            .order('id');

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 获取单个音标详情
export const getPhoneticById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('phonetics')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Phonetic not found' });
            }
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 按类型获取音标
export const getPhoneticsByType = async (req, res) => {
    try {
        const { type } = req.params; // vowel or consonant

        const { data, error } = await supabase
            .from('phonetics')
            .select('*')
            .eq('type', type)
            .order('id');

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 按分类获取音标
export const getPhoneticsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const { data, error } = await supabase
            .from('phonetics')
            .select('*')
            .eq('category', category)
            .order('id');

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
