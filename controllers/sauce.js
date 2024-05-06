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
    // Mise à jour de la sauce dans la base de données
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée avec succès !" }))
        .catch(error => res.status(400).json({ error }));
};

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // Recherche de la sauce par son identifiant dans la base de données
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Récupération du nom du fichier image de la sauce
            const filename = sauce.imageUrl.split('/images/')[1];
            // Suppression du fichier image de la sauce
            fs.unlink(`images/${filename}`, () => {
                // Suppression de la sauce dans la base de données
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée avec succès !" }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
