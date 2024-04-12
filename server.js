// Importation du module HTTP de Node.js, nécessaire pour créer un serveur HTTP
const http = require('http');

// Importation de l'application Express depuis le fichier app.js
const app = require('./app');

// Fonction pour normaliser le port fourni en argument
const normalizePort = val => {
  const port = parseInt(val, 10); // Analyse le port en entier

  if (isNaN(port)) { // Si le port n'est pas un nombre, retourne le port tel quel
    return val;
  }
  if (port >= 0) { // Si le port est un nombre positif, retourne le port
    return port;
  }
  return false; // Sinon, retourne false
};

// Normalisation du port en utilisant la valeur de l'environnement PORT ou 3000 par défaut
const port = normalizePort(process.env.PORT || '3000');

// Configuration du port de l'application Express
app.set('port', port);

// Fonction pour gérer les erreurs liées au serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') { // Si l'erreur ne concerne pas le serveur en écoute
    throw error; // Lance une exception
  }
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Créé une chaine pour indiquer l'adresse ou le port
  switch (error.code) {
    case 'EACCES': // En cas d'accès refusé
      console.error(bind + ' requires elevated privileges.'); // Affiche un message d'erreur
      process.exit(1); // Termine le processus avec un code d'erreur
      break;
    case 'EADDRINUSE': // En cas d'adresse déjà utilisée
      console.error(bind + ' is already in use.'); // Affiche un message d'erreur
      process.exit(1); // Termine le processus avec un code d'erreur
      break;
    default:
      throw error; // Lance une exception pour les autres erreurs
  }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestionnaire d'événement pour les erreurs sur le serveur
server.on('error', errorHandler);

// Gestionnaire d'événement pour le démarrage du serveur
server.on('listening', () => {
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Crée une chaine pour indiquer l'adresse ou le port
  console.log('Listening on ' + bind); // Affiche un message pour indiquer que le serveur écoute sur une adresse ou un port spécifique
});

// Le serveur écoute les connexions entrantes sur le port spécifié
server.listen(port);


