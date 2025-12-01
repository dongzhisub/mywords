import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

// 路由导入
import phoneticsRoutes from './routes/phonetics.js';
import lessonsRoutes from './routes/lessons.js';
import exercisesRoutes from './routes/exercises.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API路由
app.use('/api/phonetics', phoneticsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/progress', progressRoutes);

// 健康检查
app.get('/health', async (req, res) => {
    const dbStatus = await db.testConnection();
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus
    });
});

// 根路径
app.get('/', (req, res) => {
    res.json({
        message: 'Phonetics Learning API',
        version: '1.0.0',
        endpoints: {
            phonetics: '/api/phonetics',
            lessons: '/api/lessons',
            exercises: '/api/exercises',
            progress: '/api/progress'
        }
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// 启动服务器
// 导出 app 供 Vercel Serverless 使用
export default app;

// 只有在非 Vercel 环境下才启动监听
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/`);
        console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
}
