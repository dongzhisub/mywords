import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// 初始化Supabase客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 请在.env文件中配置SUPABASE_URL和SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 统一的数据库查询接口
export const db = {
  // 获取Supabase客户端
  client() {
    return supabase;
  },

  // 通用查询方法
  async query(table) {
    return supabase.from(table);
  },

  // 测试连接
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('phonetics')
        .select('count', { count: 'exact', head: true });

      if (error) throw error;

      return {
        success: true,
        type: 'supabase',
        url: supabaseUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default db;
