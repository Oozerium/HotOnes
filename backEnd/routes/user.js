// import express
const express = require('express');

// importe user.js du dossier controller
const userCtrl = require('../controllers/user')

// creer un routeur
const router = express.Router();

// routes pour user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exporter ce router
module.exports = router;