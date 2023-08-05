const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authControllers')
const User = require('../models/user')

const router = express.Router();

router.post('/test', authController.test)
// router.post('/signup')

router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Prosze podać pobrawny email')
    .custom((value, {req}) => {
        return User.findOne({where: {email: value }})
        .then(userDoc => {
            console.log('dom w gównem', userDoc)
            console.log(value)
            if (userDoc){
                return Promise.reject('E-Mail address już w bazie istnieje')
            }
        })
    })
], authController.signup)

router.post('/login', authController.login)

module.exports = router;