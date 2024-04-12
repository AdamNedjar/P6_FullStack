// Importation du module mongoose pour la manipulation de la base de données MongoDB
const mongoose = require('mongoose');

// Importation du module mongoose-unique-validator pour la validation des champs uniques
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour le modèle User
const userSchema = mongoose.Schema({
    // Propriété 'email' de type String, requise et unique
    email: { type: String, required: true, unique: true },
    // Propriété 'password' de type String, requise
    password: { type: String, required: true }
  });

// Application du plugin uniqueValidator pour vérifier l'unicité des champs 'email'
userSchema.plugin(uniqueValidator);

// Exportation du modèle User crée à partir du schéma userSchema
module.exports = mongoose.model('User', userSchema);