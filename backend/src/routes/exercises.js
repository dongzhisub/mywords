import express from 'express';
import {
    getExercisesByLesson,
    submitExercise,
    submitExerciseBatch
} from '../controllers/exercisesController.js';

const router = express.Router();

router.get('/lesson/:lessonId', getExercisesByLesson);
router.post('/submit', submitExercise);
router.post('/submit-batch', submitExerciseBatch);

export default router;
