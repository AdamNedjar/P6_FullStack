// Importation du module multer pour la gestion des fichiers téléchargés
const multer = require('multer');

// Définition des types MIME autorisés avec leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// Configuration du stockage des fichiers téléchargés avec Multer
const storage = multer.diskStorage({
    // Définition du répertoire de déstination des fichiers téléchargés
    destination: (req, file, callback) => {
        callback(null, 'images'); // Le répertoire de destination est 'images'
    },

    // Définition du nom de fichier pour les fichiers téléchargés
    filename: (req, file, callback) => {
        // Modification du nom de fichier pour éviter les espaces et ajout d'un timestamp pour le rendre unique
        const name = file.originalname.split('.')[0].split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension du fichier
        callback(null, name + Date.now() + '.' + extension); // Le nom de fichier est originalName_timestamp.extension
    }
});

// Exportation du middleware Multer configuré pour traiter les téléchargements de fichiers uniques de type 'image'
module.exports = multer({ storage: storage }).single('image');