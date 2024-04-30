// Importation des modules bcrypt pour le hachage des mots de passe et jsonwebtoken pour la gestion des tokens JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importation du modèle User
const User = require('../models/User');

// RegExp pour valider l'email
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// RegExp pour valider le mot de passe
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Fonction pour gérer la création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    // Vérification que l'email est valide et non vide
    if (!email || !emailRegExp.test(email)) {
        return res.status(400).json({ message: 'L\'email est invalide' });
    }

    // Vérification que le mot de passe est valide et respecte les critères spécifiés
    if (!password || !passwordRegExp.test(password)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial' });
    }

    // Hachage du mot de passe reçu dans la requête avec un coût de hachage de 10
    bcrypt.hash(password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
            const user = new User({
                email: email,
                password: hash
            });
            // Enregistrement de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};


// Fonction pour gérer l'authentification d'un utilisateur existant
  exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de données en utilisant son adresse e-mail
    User.findOne({email: req.body.email})
      .then(user => {
        // Vérification si l'utilisateur existe
        if (user === null) {
            // Si l'utilisateur n'existe pas, renvoie une erreur 401
            return res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            // Comparaison du mot de passe fourni avec le mot de passe haché de l'utilisateur
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
               // Si les mots de passe ne correspondent pas, renvoie une erreur 401
               if (!valid) {
               return res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                // Si les mots de passe correspondent, génère un token JWT avec l'ID de l'utilisateur
               return res.status(200).json({
                    userId: user._id, // ID de l'utilisateur
                    token: jwt.sign( // Génération du token JWT
                        { userId: user._id}, // Payload du token contenant l'ID de l'utilisateur
                        process.env.SECRET_TOKEN, // Clé secrète pour signer le token (à remplacer par une valeur sécurisée en production)
                        { expiresIn: '24h' } // Durée de validité du token (ici, 24 heures)
                    )
                });
            }
      })
      .catch(error => res.status(500).json( { error })); // Erreur lors de la comparaison des mots de passe
    }
    })
    .catch(error => res.status(500).json({error})); // Erreur lors de la recherche de l'utilisateur
    
    }