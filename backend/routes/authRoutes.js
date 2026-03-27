import express from 'express';
import { login, signup, logout} from '../controllers/authController.js';

const router = express.Router();

// Route : POST /api/auth/login
router.post('/login', login);

// Route : GET /api/auth/signup
router.post('/signup', signup);

// Route : POST/api/auth/logout
router.post('/logout', logout);

export default router;