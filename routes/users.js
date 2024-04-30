// Importation du module express et création d'un routeur avec express.Router()
const express = require('express');
const router = express.Router();

// Importation du contrôleur utilisateur (userCtrl)
const userCtrl = require('../controllers/user');

// Définition des routes avec les méthodes HTTP correspondantes et les fonctions de contrôleur à appeler

// Route POST '/signup' pour l'inscription d'un nouvel utilisateur
router.post('/signup', userCtrl.signup);

// Route POST '/login' pour la connexion d'un utilisateur existant
router.post('/login', userCtrl.login);

// Exportation du routeur pour une utilisation dans d'autres parties de l'application
module.exports = router;
