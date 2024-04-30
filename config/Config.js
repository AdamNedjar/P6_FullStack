const expressBrute = require('express-brute');
const store = new expressBrute.MemoryStore(); // Stockage en mémoire pour les données de tentative

// Configuration de express-brute
const bruteforce = new expressBrute(store, {
    freeRetries: 5, // Nombre de tentatives gratuites avant le blocage
    minWait: 5 * 60 * 1000, // Délai minimum en millisecondes avant de pouvoir réessayer après un blocage
    maxWait: 60 * 60 * 1000, // Délai maximum en millisecondes avant de pouvoir réessayer après un blocage
    lifetime: 24 * 60 * 60, // Durée en secondes pendant laquelle une tentative bloquée est conservée en mémoire
});

module.exports = bruteforce;
