const express = require('express'); // Framework web pour Node.js
const mongoose = require('mongoose'); // Bibliothèque de modélisation d'objets pour MongoDB
const path = require('path'); // Module intégré de Node.js pour la gestion des chemins de fichiers et des répertoires
require('dotenv').config();

//const dbUser = process.env.DB_USER;
//const dbPassword = process.env.DB_PASSWORD;
//const dbHost = process.env.DB_HOST;
//const secretToken = process.env.SECRET_TOKEN;

//console.log(`Utilisateur de la base de données :  ${dbUser}`);
//console.log(`Mot de passe de la base de données : ${dbPassword}`);
//console.log(`Hôte de la base de données : ${dbHost}`);
//console.log(`Jeton secret : ${secretToken}`);



const userRoutes = require('./routes/users'); // Routes pour l'authentification des utilisateurs
const sauceRoutes = require('./routes/sauces'); // Routes pour les opérations CRUD sur les objets "sauce"

// Configuration de l'application Express
const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour configurer les en-tetes CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser l'accès depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autoriser certains en-tetes dans la requete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autoriser certaines méthodes HTTP
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images'))); // Exposition du répertoire d'images statiques
app.use('/api/auth', userRoutes); // Routes pour l'authentification des utilisateurs
app.use('/api/sauces', sauceRoutes); // Routes pour les objets "sauce"

// Exportation de l'application pour une utilisation externe
module.exports = app;