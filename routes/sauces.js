const express = require('express');
const router = express.Router();

// Import des contrôleurs pour la gestion des sauces et des likes
const sauceCtrl = require('../controllers/sauce');
const likeCtrl = require('../controllers/like');

// Middleware d'authentification
const auth = require('../middleware/auth');

// Middleware pour la gestion des fichiers uploadés
const multer = require('../middleware/multer-config');

// Route pour la création d'une nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Route pour ajouter un like à une sauce spécifique
router.post('/:id/like', auth, likeCtrl.likeSauce);

// Route pour récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

// Route pour récupérer une sauce spécifique par son identifiant
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Route pour mettre à jour une sauce spécifique
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Route pour supprimer une sauce spécifique
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Exportation du routeur pour une utilisation dans d'autres parties de l'application
module.exports = router;
