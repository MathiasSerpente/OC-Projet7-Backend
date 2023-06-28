const express = require('express'); // Importation du module 'express'
const router = express.Router(); // Création d'un objet Router

const auth = require('../middleware/auth'); // Importation du middleware d'authentification
const multer = require('../middleware/multer-config'); // Importation du middleware pour la gestion des fichiers
const esharp = require('../middleware/sharp-config');

const libraryCtrl = require('../controllers/library'); // Importation du contrôleur pour les bibliothèques

router.get('/', libraryCtrl.getAllBooks); // Définition de la route GET pour obtenir tous les livres
router.get('/bestrating', libraryCtrl.getBestBooks); // Définition de la route GET pour obtenir les 3 meilleurs livres
router.get('/:id', libraryCtrl.getOneBook); // Définition de la route GET pour obtenir un livre spécifique
router.post('/', auth, multer, esharp, libraryCtrl.createBook); // Définition de la route POST pour créer un nouveau livre
router.post('/:id/rating', auth, libraryCtrl.createRating); // Définition de la route POST pour créer une évaluation d'un livre
router.put('/:id', auth, multer, esharp, libraryCtrl.modifyBook); // Définition de la route PUT pour modifier un livre
router.delete('/:id', auth, libraryCtrl.deleteBook); // Définition de la route DELETE pour supprimer un livre

module.exports = router;
