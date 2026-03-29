import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Account, Role, User, Category } from '../models/index.js';
import { sequelize } from '../models/index.js'; 
import { SYSTEM_COLORS } from '../utils/constants.js';

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

        // 5. Envoyer le token dans un Cookie
        res.cookie('token', token, {
            httpOnly: true,     // Empêche le vol par script (XSS)
            secure: false,      // Mettre à 'true' en production (HTTPS uniquement)
            maxAge: 24 * 60 * 60 * 1000, // Durée de vie (ici 24h en millisecondes)
            sameSite: 'lax'     // Protection contre les attaques CSRF
        });

        // On renvoie quand même une réponse JSON pour confirmer au client
        res.json({
            message: 'Connexion réussie',
            user: { email: account.email, role: account.Role.name }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
};

export const signup = async (req, res) => {
    // 1. On initialise la transaction
    const t = await sequelize.transaction();

    try {
        const { email, password, firstname, lastname } = req.body;

        const existingAccount = await Account.findOne({ where: { email } });
        if (existingAccount) {
            // Pas besoin de transaction ici, on s'arrête avant
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = await Role.findOne({ where: { name: 'user' } });

        // 2. On crée le compte EN PASSANT LA TRANSACTION { transaction: t }
        const newAccount = await Account.create({
            email,
            password_hash: hashedPassword,
            role_id: userRole.id
        }, { transaction: t });

        // 3. On crée le profil EN PASSANT AUSSI LA TRANSACTION
        const newUser = await User.create({
            firstname,
            lastname,
            account_id: newAccount.id
        }, { transaction: t });

        // 4. On crée la catégorie par défaut
        const newCategory = await Category.create({
            name: 'Général',
            color: SYSTEM_COLORS.SLATE, // Un gris bleuté par défaut
            user_id: newUser.id
        }, { transaction: t });

        // 5. SI TOUT EST OK : On valide définitivement (Commit)
        await t.commit();

        res.status(201).json({ message: "Utilisateur créé avec succès avec sa catégorie par défaut !" });

    } catch (error) {
        // 6. SI UNE ERREUR SURVIENT : On annule tout (Rollback)
        // Même si le compte a été créé à l'étape 2, il sera supprimé de la BDD
        await t.rollback();
        
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'inscription. Rien n'a été enregistré." });
    }
};

export const logout = async(req, res) => {

    // res.clearCookie prend le nom du cookie à supprimer
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // À mettre à 'true' quand tu seras en HTTPS (production)
        sameSite: 'lax'
    });

    return res.status(200).json({ message: 'Déconnexion réussie' });
};
