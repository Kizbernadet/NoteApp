import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // On va directement chercher dans les cookies grâce à cookie-parser
    const token = req.cookies.token;

    if (!token) {
        // 401 : On ne sait pas qui tu es
        return res.status(401).json({ message: 'Accès refusé. Veuillez vous connecter.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // On attache les infos (id, role) à l'objet req pour les prochains contrôleurs
        req.user = decoded;

        next();
    } catch (error) {
        // 403 : On sait qui tu es, mais ton ticket n'est plus valide
        return res.status(403).json({ message: 'Session expirée ou jeton invalide.' });
    }
};

export default authMiddleware;