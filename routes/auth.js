const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authControllers')

const router = express.Router();

router.post('/login', authController.login)
// router.post('/signup')


module.exports = router