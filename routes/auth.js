const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authControllers')
const User = require('../models/user')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Prosze podać poprawny e mail')
    .custom((value, {req}) => {
        return User.findOne({where: {email: value }})
        .then(userDoc => {
            if (userDoc){
                return Promise.reject('E-Mail address już w bazie istnieje')
            }
        })
    }),
    body('password').trim().isLength({min: 6}),
    body('name').trim().not().isEmpty()
], authController.signup)

router.post('/login',[
    body('email')
    .isEmail()
    .withMessage('Prosze podać poprawny e mail'),
    body('password').trim().isLength({min: 6}),

], authController.login)

module.exports = router;