import { Task, Category, User } from '../models/index.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, deadline, category_id } = req.body;
        const accountId = req.user.accountId; 

        // 1. Récupérer le vrai User ID (le profil)
        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const userId = user.id; // Voilà notre ID 3 !

        // 2. Vérifier la catégorie (si fournie)
        if (category_id) {
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
            category_id: category_id || null,
            user_id: userId
        });

        res.status(201).json({ message: "Tâche créée !", task: newTask });
    } catch (error) {
        // Si Sequelize renvoie une erreur de validation (ex: mauvais status)
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
        
        // 1. Récupérer le User ID
        const user = await User.findOne({ where: { account_id: accountId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // 2. Récupérer les tâches avec les détails de la catégorie
        const tasks = await Task.findAll({
            where: { user_id: user.id },
            include: [{ 
                model: Category, 
                as: 'category', 
                attributes: ['id', 'name', 'color'] // On ajoute la couleur pour le front !
            }],
            order: [
                ['created_at', 'DESC'] // Les plus récentes en premier
            ]
        });

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des tâches." });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params; // L'ID de la tâche dans l'URL
        const { title, description, status, priority, deadline, category_id } = req.body;
        const accountId = req.user.accountId;

        // 1. Récupérer le User ID
        const user = await User.findOne({ where: { account_id: accountId } });
        
        // 2. Trouver la tâche ET vérifier qu'elle appartient bien à l'utilisateur
        const task = await Task.findOne({ where: { id, user_id: user.id } });

        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée ou non autorisée." });
        }

        // 3. Si une nouvelle catégorie est fournie, on vérifie qu'elle appartient à l'user
        if (category_id) {
            const category = await Category.findOne({ where: { id: category_id, user_id: user.id } });
            if (!category) {
                return res.status(403).json({ message: "Catégorie invalide." });
            }
        }

        // 4. Mise à jour (Sequelize fusionne les modifications)
        await task.update({
            title: title || task.title,
            description: description || task.description,
            status: status || task.status,
            priority: priority || task.priority,
            deadline: deadline || task.deadline,
            category_id: category_id === undefined ? task.category_id : category_id
        });

        res.json({ message: "Tâche mise à jour !", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour." });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const accountId = req.user.accountId;

        // 1. Trouver le User
        const user = await User.findOne({ where: { account_id: accountId } });
        
        // 2. Supprimer la tâche (on vérifie l'appartenance ici aussi !)
        const deleted = await Task.destroy({
            where: { id, user_id: user.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Tâche non trouvée ou déjà supprimée." });
        }

        res.json({ message: "Tâche supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression." });
    }
};