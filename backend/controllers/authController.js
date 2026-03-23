import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Account, Role } from '../models/index.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Chercher le compte avec son rôle
        const account = await Account.findOne({ 
            where: { email },
            include: [Role] 
        });

        // 2. Si le compte n'existe pas
        if (!account) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // 3. Comparer le mot de passe (Clair vs Hash)
        const isMatch = await bcrypt.compare(password, account.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // 4. Générer le JWT
        const token = jwt.sign(
            { 
                accountId: account.id, 
                role: account.Role.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // 5. Réponse
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                email: account.email,
                role: account.Role.name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
};