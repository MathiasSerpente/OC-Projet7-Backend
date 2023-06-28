const express = require('express'); // Importation du module 'express'
const mongoose = require('mongoose'); // Importation du module 'mongoose' pour interagir avec MongoDB
const userRoutes = require('./routes/user'); // Importation des routes 'user'
const libraryRoutes = require('./routes/library'); // Importation des routes 'library'
const path = require('path'); // Importation du module 'path' pour gérer les chemins de fichiers

require('dotenv').config(); // Chargement des variables d'environnement à partir du fichier .env

// Connexion à la base de données MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_PATH}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connection to MongoDB successful!'))
  .catch(() => console.log('Connection to MongoDB failed!'));

const app = express(); // Création d'une instance de l'application Express

app.use(express.json()); // Utilisation du middleware pour analyser les données JSON des requêtes

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Configuration de l'en-tête CORS pour autoriser toutes les origines
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); // Configuration des en-têtes CORS pour autoriser certains en-têtes spécifiques
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); // Configuration des méthodes HTTP autorisées par CORS
  next();
});

app.use('/api/auth', userRoutes); // Utilisation des routes pour les utilisateurs
app.use('/api/books', libraryRoutes); // Utilisation des routes pour les bibliothèques
app.use('/images', express.static(path.join(__dirname, 'images'))); // Configuration d'un chemin statique pour les fichiers d'images

module.exports = app;
