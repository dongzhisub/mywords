import express from 'express';
import {
    getAllPhonetics,
    getPhoneticById,
    getPhoneticsByType,
    getPhoneticsByCategory
} from '../controllers/phoneticsController.js';

const router = express.Router();

router.get('/', getAllPhonetics);
router.get('/:id', getPhoneticById);
router.get('/type/:type', getPhoneticsByType);
router.get('/category/:category', getPhoneticsByCategory);

export default router;
