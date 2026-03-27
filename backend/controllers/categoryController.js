import { Category, User } from '../models/index.js';

export const createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;
        const accountId = req.user.accountId; // Toujours identifier l'auteur

        // 1. On cherche le USER relié à cet ACCOUNT
        const user = await User.findOne({ where: { account_id: accountId } });
        
        if (!user) {
            return res.status(404).json({ message: "Profil utilisateur non trouvé." });
        }

        const newCategory = await Category.create({
            name,
            color: color || '#3b82f6', // Bleu par défaut
            user_id: user.id
        });

        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la catégorie." });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const accountId = req.user.accountId;

        const user = await User.findOne({ where: { account_id: accountId } });
        
        if (!user) {
            return res.status(404).json({ message: "Profil utilisateur non trouvé." });
        }

        const categories = await Category.findAll({
            where: { user_id: user.id },
            order: [['name', 'ASC']]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération." });
    }
};