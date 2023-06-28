const http = require('http'); // Importation du module 'http' intégré de Node.js
const app = require('./app'); // Importation de l'application

// Normalisation du port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Conversion de la valeur du port en un entier

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '4000');

app.set('port', port); // Configuration du port de l'application avec le port normalisé

// Gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    // Si l'erreur n'est pas liée à la méthode 'listen'
    throw error;
  }
  const address = server.address(); // Récupère l'adresse du serveur
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Formate l'adresse du serveur
  // Gestion des différents codes d'erreur possibles
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // Création du serveur HTTP

server.on('error', errorHandler); // Gestion des erreurs du serveur
server.on('listening', () => {
  // Lorsque le serveur commence à écouter les requêtes
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Formate l'adresse du serveur
  console.log('Listening on ' + bind); // Affiche un message indiquant sur quel port le serveur écoute
});

server.listen(port); // Le serveur écoute les requêtes sur le port spécifié
