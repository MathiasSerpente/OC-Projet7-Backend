const express = require('express'); // Importation du module 'express'
const router = express.Router(); // Création d'un objet Router

const userCtrl = require('../controllers/user'); // Importation du contrôleur pour les utilisateurs
const passwordValidator = require('../middleware/password-validator'); // Importation du middleware pour la validation des mots de passe

router.post('/signup', passwordValidator, userCtrl.signup); // Définition de la route POST pour l'inscription d'un nouvel utilisateur
router.post('/login', userCtrl.login); // Définition de la route POST pour la connexion d'un utilisateur existant

module.exports = router;
