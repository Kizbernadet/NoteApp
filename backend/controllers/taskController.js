import { Task, Category, User } from '../models/index.js';
import { Op } from 'sequelize';

// Actions de base (CRUD)
export const createTask = async (req, res) => {
    try {
        let { title, description, status, priority, deadline} = req.body;
        let { category_id } = req.body;
        const accountId = req.user.accountId; 

        // 1. Récupérer le profil User
        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const userId = user.id;

        // 2. Gestion de la catégorie (Logique par défaut)
        if (!category_id) {
            // Si pas de catégorie, on cherche "Général"
            const defaultCategory = await Category.findOne({ 
                where: { name: 'Général', user_id: userId } 
            });
            if (defaultCategory) {
                category_id = defaultCategory.id;
            }
        } else {
            // Si fournie, on vérifie l'appartenance
            const category = await Category.findOne({ 
                where: { id: category_id, user_id: userId } 
            });
            if (!category) {
                return res.status(403).json({ message: "Catégorie invalide ou non autorisée." });
            }
        }

        // 3. Création
        const newTask = await Task.create({
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            deadline,
            category_id: category_id || null, // Fallback ultime au cas où "Général" n'existe pas
            user_id: userId
        });

        res.status(201).json({ message: "Tâche créée !", task: newTask });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: "Données invalides", 
                errors: error.errors.map(e => e.message) 
            });
        }
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la tâche." });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const accountId = req.user.accountId;
        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const tasks = await Task.findAll({
            where: { user_id: user.id },
            include: [{ 
                model: Category, 
                as: 'category', 
                attributes: ['id', 'name', 'color'] 
            }],
            order: [['created_at', 'DESC']]
        });

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération." });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, deadline, category_id } = req.body;
        const accountId = req.user.accountId;

        const user = await User.findOne({ where: { account_id: accountId } });
        const task = await Task.findOne({ where: { id, user_id: user.id } });

        if (!task) return res.status(404).json({ message: "Tâche non trouvée." });

        if (category_id) {
            const category = await Category.findOne({ where: { id: category_id, user_id: user.id } });
            if (!category) return res.status(403).json({ message: "Catégorie invalide." });
        }

        await task.update({
            title: title || task.title,
            description: description || task.description,
            status: status || task.status,
            priority: priority || task.priority,
            deadline: deadline || task.deadline,
            // On utilise undefined pour permettre de vider la catégorie si besoin via null
            category_id: category_id !== undefined ? category_id : task.category_id
        });

        res.json({ message: "Tâche mise à jour !", task });
    } catch (error) {
        res.status(500).json({ message: "Erreur de mise à jour." });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const accountId = req.user.accountId;
        const user = await User.findOne({ where: { account_id: accountId } });
        
        const deleted = await Task.destroy({ where: { id, user_id: user.id } });

        if (!deleted) return res.status(404).json({ message: "Tâche non trouvée." });

        res.json({ message: "Tâche supprimée." });
    } catch (error) {
        res.status(500).json({ message: "Erreur de suppression." });
    }
};

// Actions Groupées (Bulk)
export const deleteMultipleTasks = async (req, res) => {
    try {
        const { ids } = req.body;
        const accountId = req.user.accountId;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Aucun identifiant fourni." });
        }

        // Vérifie que tous les IDs sont des nombres
        if (!ids.every(Number.isInteger)) {
            return res.status(400).json({ message: "Le format des identifiants est invalide." });
        }

        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const deletedCount = await Task.destroy({
            where: {
                id: { [Op.in]: ids },
                user_id: user.id 
            }
        });

        res.json({ 
            message: `${deletedCount} tâche(s) supprimée(s) avec succès.`,
            count: deletedCount 
        });
    } catch (error) {
        console.error("Erreur Bulk Delete Tasks:", error);
        res.status(500).json({ message: "Erreur lors de la suppression groupée." });
    }
};

export const bulkUpdateTasks = async (req, res) => {
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

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Aucune donnée de mise à jour fournie." });
        }

        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // Sécurité catégorie
        if (updates.category_id) {
            const category = await Category.findOne({ 
                where: { id: updates.category_id, user_id: user.id } 
            });
            if (!category) return res.status(403).json({ message: "Catégorie cible invalide." });
        }

        // L'action groupée avec gestion du retour Sequelize
        const result = await Task.update(updates, {
            where: {
                id: { [Op.in]: ids },
                user_id: user.id
            }
        });

        const updatedCount = Array.isArray(result) ? result[0] : result;

        res.json({ 
            message: `${updatedCount} tâche(s) mise(s) à jour.`,
            count: updatedCount 
        });
    } catch (error) {
        console.error("Erreur Bulk Update Tasks:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour groupée." });
    }
};