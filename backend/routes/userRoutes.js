import express from 'express';
import { getMe } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// La route est protégée : le middleware s'exécute AVANT getMe
router.get('/me', authMiddleware, getMe);

export default router;