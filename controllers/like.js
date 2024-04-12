const Sauce = require('../models/Sauce');

// Fonction pour noter une sauce
exports.likeSauce = (req, res, next) => {
    // Récupération de l'identifiant de l'utilisateur, du type de like et de l'identifiant de la sauce depuis la requête
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;

    // Recherche de la sauce dans la base de données
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            // Création d'un nouvel objet contenant les nouvelles valeurs des champs usersLiked, usersDisliked, likes et dislikes
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            };

            // Mise à jour des champs en fonction du type de like
            switch (like) {
                case 1:
                    newValues.usersLiked.push(userId);
                    break;
                case -1:
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:
                    if (newValues.usersLiked.includes(userId)) {
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };

            // Calcul du nombre de likes et de dislikes
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;

            // Mise à jour de la sauce dans la base de données avec les nouvelles valeurs
            Sauce.updateOne({ _id: sauceId }, newValues)
                .then(() => res.status(200).json({ message: 'Sauce notée avec succès !' }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
