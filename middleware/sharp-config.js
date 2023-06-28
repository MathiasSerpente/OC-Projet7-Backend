const sharp = require('sharp'); // Importation du module 'sharp' pour le traitement des images
sharp.cache(false); // Désactivation de la mise en cache des données dans 'sharp'
const fs = require('fs'); // Importation du module 'fs' (système de fichiers) de Node.js

// Optimisation de l'image
const esharp = async (req, res, next) => {
  if (!req.file) {
    return next(); // Vérification : si aucun fichier n'a été téléchargé, passage au middleware suivant
  }
  try {
    // Utilisation de 'sharp' pour redimensionner l'image, la convertir en format WebP et l'enregistrer
    await sharp(req.file.path)
      .resize({
        width: 206,
        height: 260,
        fit: sharp.fit.cover, // L'image couvre entièrement les dimensions spécifiées, sans déformation
      })
      .webp({ quality: 75 })
      .toFile(`${req.file.path.split('.')[0]}_optimized.webp`);

    // Suppression l'image originale à l'aide du module 'fs'
    fs.unlink(req.file.path, (error) => {
      // Mise à jour du chemin du fichier avec le chemin de l'image optimisée
      req.file.path = `${req.file.path.split('.')[0]}_optimized.webp`;
      if (error) {
        console.log(error);
      }
      next(); // Passage au prochain middleware
    });
  } catch (error) {
    res.status(500).json({ error }); // Erreur : lors de l'optimisation
  }
};

module.exports = esharp;
