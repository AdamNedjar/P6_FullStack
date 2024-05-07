 // Importation du module fs pour la gestion des fichiers et du modèle Sauce
const fs = require('fs');
const Sauce = require('../models/Sauce');

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // Extraction de l'objet sauce depuis les données de la requête
    const sauceObject = JSON.parse(req.body.sauce);
    // Suppression de l'identifiant (_id) de l'objet sauce
    delete sauceObject._id;
    // Création d'une nouvelle instance de Sauce avec les données reçues dans la requête
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    // Sauvegarde de la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Fonction pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // Recherche de toutes les sauces dans la base de données
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Fonction pour récupérer une sauce par son identifiant
exports.getOneSauce = (req, res, next) => {
    // Recherche d'une sauce par son identifiant dans la base de données
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: 'Sauce non trouvée' }));
};

// Fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    // Vérification si une nouvelle image est fournie dans la requête
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // Recherche de la sauce par son identifiant dans la base de données
    Sauce.findOne({ _id: req.params.id, userId: req.userData.userId })
        .then(sauce => {
            // Vérification si la sauce existe et si l'utilisateur actuel est celui qui a créé la sauce
            if (!sauce) {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette sauce' });
            }
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: "Sauce modifiée avec succès !" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};




exports.deleteSauce = (req, res, next) => {
    /* Utilisation de la méthode findOne() du modèle Mongoose qui renvoit la Sauce 
    ayant le même _id que le paramètre de la requête */
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // On verifie que la sauce appartient bien à l'utilisateur
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: "Non-autorisé !" });
        } else {
          // Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
          const filename = sauce.imageUrl.split("/images/")[1];
          // Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => {
                res.status(200).json({ message: "Sauce Supprimée !" });
              })
              .catch((error) => {
                res.status(401).json({ error });
              });
          });
        }
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  };