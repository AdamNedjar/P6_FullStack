// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');

// Exportation du middleware
module.exports = (req, res, next) => {
    try {
        //Récupération du token d'authentification depuis l'en-tete Authorization de la requete
        const token = req.headers.authorization.split(' ')[1];
        // Vérification du token et extraction des informations encodées (payload)  
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        // Extraction de l'ID utilisateur à partir du token décodé
        const userId = decodedToken.userId;

        // Vérifier si req.body.userId existe et s'il est différent de userId
        if( req.body.userId && req.body.userId !== userId ) {
            // Si l'ID de l'utilisateur dans la requête est différent de l'ID authentifié, générer une exception
            throw 'User ID non valable';
        } else {
            // Si l'ID de l'utilisateur est valide, passer au middleware suivant
            next();
        }
       // Si le token est invalide ou expiré, renvoyez une erreur 403 (Accès refusé)
    } catch (error) {
        res.status(403).json({ message: 'Accès refusé ! Veuillez vous authentifier.' });
    }
};