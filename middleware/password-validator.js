const passwordComplexity = require('joi-password-complexity'); // Importation du module 'joi-password-complexity'

// Définition des rèlges pour le mot de passe
const complexityOptions = {
  min: 8, // Longueur minimale du mot de passe
  max: 40, // Longueur maximale du mot de passe
  lowerCase: 1, // Doit contenir au moins une minuscule
  upperCase: 1, // doit contenir au moins une majuscule
  numeric: 1, // Doit contenir au moins un chiffre
  symbol: 1, // Doit contenir au moins un caractère spécial
};

// Création d'un nouveau schéma de complexité de mot de passe basé sur les options définies
const passwordSchema = new passwordComplexity(complexityOptions).disallow(' '); // ".disalow(' ')" interndit les espaces

module.exports = (req, res, next) => {
  const password = req.body.password; // Recupéraiton du mot de passe de la requête
  const { error } = passwordSchema.validate(password); // Validation du mot de passe

  if (error) {
    return res.status(422).json({ error }); // Erreur : le mot de passe est invalide
  }

  next(); // Le mot de passe est valide, passage au middleware suivant
};
