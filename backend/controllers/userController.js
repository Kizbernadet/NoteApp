import { User, Account } from '../models/index.js';

export const getMe = async (req, res) => {
    try {
        // req.user contient l'ID grâce au middleware
        const user = await User.findOne({
            where: { account_id: req.user.accountId },
            include: [{ 
                model: Account, 
                attributes: ['email'] // On ne veut pas renvoyer le hash du mot de passe !
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
};