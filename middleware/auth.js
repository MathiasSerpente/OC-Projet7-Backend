const jwt = require('jsonwebtoken'); // Importation du module 'jsonwebtoken'

require('dotenv').config(); // Chargement des variables d'environnement à partir du fichier .env

// Authentification de l'utilisateur
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extraction du token du header 'Authorization'
    const decodedToken = jwt.verify(token, `${process.env.KEY}`); // Vérification et décryptage du token avec la clé
    const userId = decodedToken.userId; // Extraction de l'id utilisateur à partir du token décodé
    req.auth = {
      userId: userId,
    }; // Ajout de l'id utilisateur à l'objet de requête 'req'
    next(); // Passage au prochain middleware
  } catch (error) {
    res.status(401).json({ error }); // Erreur : non autorisé
  }
};
