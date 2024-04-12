// Importation du module mongoose pour la manipulation de la base de données MongoDB
const mongoose = require('mongoose');

// Définition du schéma pour le modèle Sauce
const sauceSchema = mongoose.Schema({
  // Propriétés avec les types requise (required)
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
  });
  
  // Exportation du modèle Sauce crée à partir du schéma thingSchema
  module.exports = mongoose.model('Sauce', sauceSchema);