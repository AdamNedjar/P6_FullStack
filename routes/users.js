const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// RegExp pour valider l'email
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// RegExp pour valider le mot de passe
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Route POST '/signup' pour l'inscription d'un nouvel utilisateur
router.post('/signup', (req, res, next) => {
    const { email, password } = req.body;

    // Vérifier que l'email est valide et non vide
    if (!email || !emailRegExp.test(email)) {
        return res.status(400).json({ message: 'L\'email est invalide' });
    }

    // Vérifier que le mot de passe est valide et respecte les critères spécifiés
    if (!password || !passwordRegExp.test(password)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial' });
    }

    // Appeler la fonction de contrôleur pour l'inscription de l'utilisateur si les données sont valides
    userCtrl.signup(req, res, next);
});

// Route POST '/login' pour la connexion d'un utilisateur existant
router.post('/login', userCtrl.login);

// Exportation du routeur pour une utilisation dans d'autres parties de l'application
module.exports = router;
