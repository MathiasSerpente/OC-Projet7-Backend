const multer = require('multer'); // Importation du module 'multer'

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Configuration du stockage des fichiers téléchargés avec multer
const storage = multer.diskStorage({
  // Définition du répertoire de destination des fichiers téléchargés
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Génèration du nom de fichier unique pour le fichier téléchargé
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name.split('.')[0] + '_' + Date.now() + '.' + extension);
  },
});

// Exportation du middleware 'multer' configuré pour gérer le téléchargement d'un seul fichier associé au champ de formulaire nommé 'image'
module.exports = multer({ storage: storage }).single('image');
