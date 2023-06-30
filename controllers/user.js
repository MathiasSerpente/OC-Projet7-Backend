const bcrypt = require('bcrypt'); // Importation du module 'bcrypt' pour le hachage des mots de passe
const User = require('../models/user'); // Importation du modèle 'User' pour la manipulation des données utilisateur
const jwt = require('jsonwebtoken'); // Importation du module 'jsonwebtoken' pour la génération de jetons d'authentification

require('dotenv').config(); // Chargement des variables d'environnement à partir du fichier .env

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Utilisation de 'bcrypt' pour hacher le mot de passe fourni avec un coût de hachage de 10
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un un nouvel utilisateur en utilisant le modèle 'User' avec l'email et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Sauvegarde l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: 'User created!' })) // Succès : utilisateur créé
        .catch((error) => res.status(500).json({ error })); // Erreur : lors de la sauvegarde de l'utilisateur
    })
    .catch((error) => res.status(500).json({ error })); // Erreur : lors du hachage du mot de passe
};

// Connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche de l'utilisateur avec l'adresse email fournie dans la requête
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'User not found!' }); // Erreur : l'utilisateur n'est pas dans la base de données
      }
      bcrypt
        .compare(req.body.password, user.password) // Comparaison du mot de passe fourni avec le mot de passe haché de l'utilisateur
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Incorrect password!' }); // Erreur : mot de passe incorrect
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.KEY}`, {
              expiresIn: '24h',
            }),
          }); // Succès : renvoie l'id de l'utilisateur avec un token fourni par 'jwt' valable 24 heures
        })
        .catch((error) => res.status(500).json({ error })); // Erreur : lors de la comparaison du mot de passe
    })
    .catch((error) => res.status(500).json({ error })); // Erreur : lors de la recherche de l'utilisateur
};
