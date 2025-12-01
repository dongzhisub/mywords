import express from 'express';
import {
    getStudentProgress,
    updateProgress,
    getLessonProgress
} from '../controllers/progressController.js';

const router = express.Router();

// 进度相关路由 - 使用 studentId 参数
router.get('/:studentId', getStudentProgress);
router.get('/:studentId/lesson/:lessonId', getLessonProgress);
router.post('/:studentId', updateProgress);

export default router;
