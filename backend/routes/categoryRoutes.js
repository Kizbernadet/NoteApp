import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // Protection globale

router.post('/', createCategory);
router.get('/', getAllCategories);

router.get('/test', (req, res) => {
    res.status(200).json({
        message: "Mon route fonctionne"
    })
})

export default router;