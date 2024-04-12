// Importation des modules bcrypt pour le hachage des mots de passe et jsonwebtoken pour la gestion des tokens JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importation du modèle User
const User = require('../models/User');

// Fonction pour gérer la création d'un nouvel utilisateur
exports.signup = (req, res, next) =>{
// Hachage du mot de passe reçu dans la requête avec un coût de hachage de 10
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'e-mail et le mot de passe haché
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Enregistrement de l'utilisateur dans la base de données
        user.save()
            .then(() => res.status(201).json({message : 'Utilisateur crée !'}))
            .catch(error => res.status(400).json({message : error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


// Fonction pour gérer l'authentification d'un utilisateur existant
  exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de données en utilisant son adresse e-mail
    User.findOne({email: req.body.email})
      .then(user => {
        // Vérification si l'utilisateur existe
        if (user === null) {
            // Si l'utilisateur n'existe pas, renvoie une erreur 401
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            // Comparaison du mot de passe fourni avec le mot de passe haché de l'utilisateur
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
               // Si les mots de passe ne correspondent pas, renvoie une erreur 401
               if (!valid) {
                res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                // Si les mots de passe correspondent, génère un token JWT avec l'ID de l'utilisateur
                res.status(200).json({
                    userId: user._id, // ID de l'utilisateur
                    token: jwt.sign( // Génération du token JWT
                        { userId: user._id}, // Payload du token contenant l'ID de l'utilisateur
                        'RANDOM_TOKEN_SECRET', // Clé secrète pour signer le token (à remplacer par une valeur sécurisée en production)
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