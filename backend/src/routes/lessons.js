import express from 'express';
import {
    getAllLessons,
    getLessonById,
    getLessonPhonetics,
    getLessonConfusionPairs
} from '../controllers/lessonsController.js';

const router = express.Router();

router.get('/', getAllLessons);
router.get('/:id', getLessonById);
router.get('/:id/phonetics', getLessonPhonetics);
router.get('/:id/confusion-pairs', getLessonConfusionPairs);

export default router;
