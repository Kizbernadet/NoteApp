import { Note, User, Category } from '../models/index.js';

export const createNote = async (req, res) => {
    try {
        const { title, content, category_id, is_favorite } = req.body;
        const accountId = req.user.accountId;

        // --- VALIDATION DU CONTENU ---
        if (!content || content.trim() === "") {
            return res.status(400).json({ 
                message: "Le contenu de la note ne peut pas être vide." 
            });
        }

        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        
        if (category_id) {
            const category = await Category.findOne({ where: { id: category_id, user_id: user.id } });
            if (!category) return res.status(403).json({ message: "Catégorie invalide." });
        }

        const newNote = await Note.create({
            title,
            content,
            is_favorite: is_favorite || false,
            user_id: user.id,
            category_id: category_id || null 
        });

        res.status(201).json(newNote);
    } catch (error) {
        // Gestion des erreurs de validation Sequelize (si title manque par ex)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ errors: error.errors.map(e => e.message) });
        }
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la note." });
    }
};

export const getAllNotes = async (req, res) => {
    try {
        const accountId = req.user.accountId;
        const user = await User.findOne({ where: { account_id: accountId } });

        const notes = await Note.findAll({
            where: { 
                user_id: user.id,
                is_archived: false // On ne montre pas les archives par défaut
            },
            include: [{ model: Category, as: 'category', attributes: ['name', 'color'] }],
            order: [
                ['is_favorite', 'DESC'], // Les favorites en premier !
                ['created_at', 'DESC']
            ]
        });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération." });
    }
};