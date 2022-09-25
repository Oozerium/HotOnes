const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Récupère les sauces depuis la BDD
router.get('/',auth,sauceCtrl.getAllSauces);
// Récupère une sauce spécifique
router.get('/:id',auth,sauceCtrl.getOneSauce);
// Enregistre une sauce dans la BDD 
router.post('/',auth,multer,sauceCtrl.addOneSauce);

// Permet de modifier une sauce
router.put('/:id',auth,multer,sauceCtrl.updateOneSauce);
// Permet de supprimer une sauce
router.delete('/:id',auth,sauceCtrl.deleteOneSauce);
router.post('/:id/like',auth,sauceCtrl.like);

// exporter ce router
module.exports = router;



