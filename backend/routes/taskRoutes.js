import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask, bulkUpdateTasks, deleteMultipleTasks } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. Appliquer le middleware à TOUTES les routes qui suivent
router.use(authMiddleware);

// 2. Définir les routes pour les actions groupées (Bulk)
router.patch('/bulk-update', bulkUpdateTasks);
router.delete('/bulk-delete', deleteMultipleTasks);

// 3. Définir les routes (elles sont déjà protégées par le .use ci-dessus)
router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);



// 5. Exporter le router
export default router;