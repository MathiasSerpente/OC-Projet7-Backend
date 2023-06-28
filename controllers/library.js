const Book = require('../models/Book'); // Importation du modèle 'Book' pour la manipulation des données de livres
const fs = require('fs'); // Importation du module 'fs' (système de fichiers) de Node.js

// Récupération de tous les livres de la base de données
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books)) // Succès
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Récupération des trois meilleurs livres
exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Triage des livres par ordre décroissant de 'averageRating'
    .limit(3) // Limitation du résultat à 3 livres
    .then((books) => res.status(200).json(books)) // Succès
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Récupération d'un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche d'un livre spécifique grâce à son identifiant dans l'url de la requête
    .then((book) => res.status(200).json(book)) // Succès
    .catch((error) => res.status(404).json({ error })); // Erreur : le livre n'a pas été trouvé
};

// Création d'un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Convertit l'objet 'book' de la requête en un objet JavaScript
  // Suppression des propriétés '_id' et '_userId'
  delete bookObject._id;
  delete bookObject._userId;
  // Création d'une instance du modèle 'Book' avec les propriétés récupérées dans la requête
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Ajout de l'ID de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename.split('.')[0]
    }_optimized.webp`, // Construction de l'URL de l'image (optimisée par 'sharp')
    averageRating: bookObject.ratings[0].grade, // Récupération de la note et assignation à la propriété 'averageRating'
  });
  // Sauvegarde du livre dans la base de données
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Book created!' }); // Succès : le livre a été créé
    })
    .catch((error) => {
      res.status(400).json({ error }); // Erreur : lors de la création du livre
    });
};

// Création d'une nouvelle note
exports.createRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche d'un livre spécifique grâce à son identifiant dans l'url de la requête
    .then((book) => {
      const userIdCheck = book.ratings.includes(
        (rating) => rating.userId == req.body.userId
      ); // Création d'un booléen : si l'utilisateur a déjà noté le livre 'userIdCheck' = true
      // Vérification : l'utilisateur n'a pas noté le livre + note comprise entre 0 et 5
      if (!userIdCheck && req.body.rating >= 0 && req.body.rating <= 5) {
        // Ajout de la nouvelle note à la liste des notes du livre
        book.ratings.push({
          userId: req.auth.userId,
          grade: req.body.rating,
        });
        let sum = 0;
        for (rating of book.ratings) {
          sum += rating.grade; // Somme des notes
        }
        // Calcul de la moyenne des notes du livre avec une précision d'une décimale
        let average = sum / book.ratings.length;
        average = average.toFixed(1);
        book.averageRating = average; // Mise à jour de la propriété 'averageRating' du livre avec la nouvelle moyenne
        // Sauvegarde des modifications apportées au livre dans la base de données
        return book
          .save()
          .then((book) => {
            res.status(200).json(book); // Succès
          })
          .catch((error) => {
            res.status(400).json({ error }); // Erreur : lors de la sauvegarde des modifications du livre
          });
      } else {
        res.status(409).json({ message: 'Book already rated!' }); // Erreur : l'utilisateur a déjà noté le livre
      }
    })
    .catch((error) => {
      res.status(404).json({ error }); // Erreur : le livre n'a pas été trouvé
    });
};

// Modification d'un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file // Vérification de la présence d'un fichier attaché à la requête
    ? {
        ...JSON.parse(req.body.book), // Convertion de l'objet de la requête en objet JavaScript et récupération de ses propriétés
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename.split('.')[0]
        }_optimized.webp`, // Construction et mise à jour de l'URL de l'image
      }
    : { ...req.body }; // Récupération des propriétés de l'objet de la requête
  delete bookObject._userId; // Suppression de la propriété '_userId'
  Book.findOne({ _id: req.params.id }) // Recherche d'un livre spécifique grâce à son identifiant dans l'url de la requête
    .then((book) => {
      // Vérification : l'id de l'utilisateur du livre doit correspondre à l'id de l'utilisateur authentifié
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized!' }); // Erreur : l'utilisateur n'est pas autorisé à modifier le livre
      } else if (req.file) {
        const filename = book.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {}); // Suppression du précédent fichier image
      }
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id } // Mise à jour des informations du livre avec les nouvelles données
      )
        .then(res.status(200).json({ message: 'Book modified!' })) // Succès
        .catch((error) => res.status(400).json({ error })); // Erreur : lors de la mise à jour du livre
    })
    .catch((error) => res.status(404).json({ error })); // Erreur : le livre n'a pas été trouvé
};

// Suppression d'un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche d'un livre spécifique grâce à son identifiant dans l'url de la requête
    .then((book) => {
      // Vérification : l'id de l'utilisateur du livre doit correspondre à l'id de l'utilisateur authentifié
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized!' }); //
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        // Suppression du fichier image
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id }) // Suppression du livre dans la base de données
            .then(() => {
              res.status(200).json({ message: 'Book deleted!' }); // Succès
            })
            .catch((error) => res.status(400).json({ error })); // Erreur : lors de la suppression du livre
        });
      }
    })
    .catch((error) => {
      res.status(404).json({ error }); // Erreur : le livre n'a pas été trouvé
    });
};
