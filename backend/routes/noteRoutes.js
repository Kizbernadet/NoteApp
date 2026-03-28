import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createNote, getAllNotes, updateNoteStatus, updateNote, deleteNote, bulkUpdateNotes, deleteMultipleNotes} from '../controllers/noteController.js';

const router = express.Router()

// 1. Appliquer le middleware à TOUTES les routes qui suivent
router.use(authMiddleware);

router.patch('/bulk-update', bulkUpdateNotes);
router.delete('/bulk-delete', deleteMultipleNotes);

router.get('/test', (req, res) => {
    res.status(200).json({
        message: "la route fonctionne"
    })
})

router.post('/', createNote);
router.get('/', getAllNotes);
router.patch('/:id', updateNoteStatus);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;