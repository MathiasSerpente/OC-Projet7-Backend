const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const libraryCtrl = require('../controllers/library');

router.get('/', libraryCtrl.getAllBooks);
router.get('/bestrating', libraryCtrl.getBestBooks);
router.get('/:id', libraryCtrl.getOneBook);
router.post('/', auth, multer, libraryCtrl.createBook);
router.post('/:id/rating', auth, libraryCtrl.createRating);
router.put('/:id', auth, libraryCtrl.modifyBook);
router.delete('/:id', auth, libraryCtrl.deleteBook);

module.exports = router;
