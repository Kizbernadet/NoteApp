import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createNote, getAllNotes } from '../controllers/noteController.js';

const router = express.Router()

// 1. Appliquer le middleware à TOUTES les routes qui suivent
router.use(authMiddleware);

// 2. Définir les routes (elles sont déjà protégées par le .use ci-dessus)
router.post('/', createNote);
router.get('/', getAllNotes);

router.get('/test', (req, res) => {
    res.status(200).json({
        message: "la route fonctionne"
    })
})

export default router;