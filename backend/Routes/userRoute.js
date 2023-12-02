// routes/userRoutes.js
const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.post('/login', userController.login);

router.post('/signup', userController.signup);


module.exports = router;
