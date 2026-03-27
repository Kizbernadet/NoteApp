import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. Appliquer le middleware à TOUTES les routes qui suivent
router.use(authMiddleware);

// 2. Définir les routes (elles sont déjà protégées par le .use ci-dessus)
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/test', (req, res) => {
    res.status(200).json({
        message: "Mon route fonctionne"
    })
})

export default router;