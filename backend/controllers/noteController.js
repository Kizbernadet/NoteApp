import { Note, User, Category } from '../models/index.js';
import { Op } from 'sequelize';

export const createNote = async (req, res) => {
    try {
        const { title, content, is_favorite } = req.body;
        let { category_id } = req.body;
        const accountId = req.user.accountId; // Récupéré du token via le middleware

        // 1. Validation du contenu (Logique métier)
        if (!content || content.trim() === "") {
            return res.status(400).json({ 
                message: "Le contenu de la note ne peut pas être vide." 
            });
        }

        // 2. Le "Pont" : Trouver le profil User lié à cet Account
        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) {
            return res.status(404).json({ message: "Profil utilisateur non trouvé." });
        }

        // 3. Vérification de la catégorie (doit appartenir à ce user)
        if (!category_id) {
            const defaultCategory = await Category.findOne({ 
                where: { name: 'Général', user_id: user.id } 
            });
            if (defaultCategory) {
                category_id = defaultCategory.id;
            }
        } else {
            // Si une catégorie est fournie, on vérifie qu'elle appartient au user
            const category = await Category.findOne({ where: { id: category_id, user_id: user.id } });
            if (!category) return res.status(403).json({ message: "Catégorie invalide." });
        }

        // 4. Création avec le bon ID utilisateur
        const newNote = await Note.create({
            title,
            content,
            is_favorite: is_favorite || false,
            user_id: user.id, // Utilisation de l'ID interne (Profil)
            category_id: category_id || null 
        });

        res.status(201).json(newNote);

    } catch (error) {
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
        
        // Trouver le user d'abord
        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const notes = await Note.findAll({
            where: { 
                user_id: user.id,
                is_archived: false 
            },
            include: [{ 
                model: Category, 
                as: 'category', 
                attributes: ['name', 'color'] 
            }],
            order: [
                ['is_favorite', 'DESC'], 
                ['created_at', 'DESC']
            ]
        });

        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur de récupération des notes." });
    }
};

export const updateNoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_favorite, is_archived } = req.body; // On récupère ce qu'on veut changer
        const accountId = req.user.accountId;

        const user = await User.findOne({ where: { account_id: accountId } });
        
        const note = await Note.findOne({ where: { id, user_id: user.id } });
        if (!note) return res.status(404).json({ message: "Note non trouvée." });

        // Mise à jour partielle
        if (is_favorite !== undefined) note.is_favorite = is_favorite;
        if (is_archived !== undefined) note.is_archived = is_archived;

        await note.save();
        res.json({ message: "Note mise à jour", note });
    } catch (error) {
        res.status(500).json({ message: "Erreur de mise à jour." });
    }
};

// MISE À JOUR (PUT) - Pour modifier le titre, contenu, catégorie, etc.
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category_id, is_favorite, is_archived } = req.body;
        const accountId = req.user.accountId;

        const user = await User.findOne({ where: { account_id: accountId } });
        
        // On cherche la note ET on vérifie qu'elle appartient bien au user
        const note = await Note.findOne({ where: { id, user_id: user.id } });
        if (!note) return res.status(404).json({ message: "Note non trouvée ou non autorisée." });

        // Si on change de catégorie, on vérifie qu'elle appartient aussi au user
        if (category_id) {
            const category = await Category.findOne({ where: { id: category_id, user_id: user.id } });
            if (!category) return res.status(403).json({ message: "Catégorie invalide." });
        }

        // Mise à jour des champs
        await note.update({
            title: title || note.title,
            content: content || note.content,
            category_id: category_id !== undefined ? category_id : note.category_id,
            is_favorite: is_favorite !== undefined ? is_favorite : note.is_favorite,
            is_archived: is_archived !== undefined ? is_archived : note.is_archived
        });

        res.json({ message: "Note mise à jour avec succès", note });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour." });
    }
};

// SUPPRESSION (DELETE)
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const accountId = req.user.accountId;

        const user = await User.findOne({ where: { account_id: accountId } });
        
        const deleted = await Note.destroy({ 
            where: { id, user_id: user.id } 
        });

        if (!deleted) return res.status(404).json({ message: "Note non trouvée." });

        res.json({ message: "Note supprimée définitivement." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression." });
    }
};

export const deleteMultipleNotes = async (req, res) => {
    try {
        const { ids } = req.body; // On attend un tableau d'IDs : [1, 2, 5]
        const accountId = req.user.accountId;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Aucun identifiant fourni." });
        }

        // Vérifie que tous les IDs sont des nombres
        if (!ids.every(Number.isInteger)) {
            return res.status(400).json({ message: "Le format des identifiants est invalide." });
        }

        const user = await User.findOne({ where: { account_id: accountId } });

        const deletedCount = await Note.destroy({
            where: {
                id: { [Op.in]: ids },
                user_id: user.id // Sécurité critique
            }
        });

        res.json({ 
            message: `${deletedCount} note(s) supprimée(s) avec succès.`,
            count: deletedCount 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression groupée." });
    }
};

export const bulkUpdateNotes = async (req, res) => {
    try {
        const { ids, updates } = req.body; 
        const accountId = req.user.accountId;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Aucun identifiant fourni." });
        }

        // Vérifie que tous les IDs sont des nombres
        if (!ids.every(Number.isInteger)) {
            return res.status(400).json({ message: "Le format des identifiants est invalide." });
        }

        // On vérifie que 'updates' existe pour éviter de crash au point 4
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Aucune donnée de mise à jour fournie." });
        }

        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        // Sécurité catégorie
        if (updates.category_id) {
            const category = await Category.findOne({ 
                where: { id: updates.category_id, user_id: user.id } 
            });
            if (!category) return res.status(403).json({ message: "Catégorie cible invalide." });
        }

        // --- LA CORRECTION EST ICI ---
        // On récupère le résultat complet sans déstructuration immédiate
        const result = await Note.update(updates, {
            where: {
                id: { [Op.in]: ids },
                user_id: user.id
            }
        });

        // Sous Postgres, result est [count]. Sous d'autres, ça peut être juste count.
        const updatedCount = Array.isArray(result) ? result[0] : result;

        res.json({ 
            message: `${updatedCount} note(s) mise(s) à jour.`,
            count: updatedCount 
        });
    } catch (error) {
        console.error("DEBUG BULK UPDATE ERROR:", error); 
        // On renvoie l'erreur brute à Postman pour comprendre
        res.status(500).json({ 
            message: "Erreur lors de la mise à jour groupée.",
            error: error.message,
            stack: error.stack 
        });
    }
};