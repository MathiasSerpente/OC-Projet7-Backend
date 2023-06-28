const mongoose = require('mongoose'); // Importation du module 'mongoose'
const uniqueValidator = require('mongoose-unique-validator'); // Importation du plugin 'uniqueValidator' pour la validation des champs uniques

// Définition du schéma d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // Application du plugin 'uniqueValidator' au schéma d'utilisateur

module.exports = mongoose.model('User', userSchema);
