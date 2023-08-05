require("dotenv").config();
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.test = (req, res) => {
  // console.log('req ', req) 
  console.log('req body', req.body) 
  console.log('req User', req.user)
  res.status(200).json('g')
}

exports.signup = async (req, res, next) => {
  // const errors = null
  const errors = validationResult(req);
  // ------------------------
  const email = req.body.email
  const name = req.body.name || 'test'
  const password = req.body.password || 'test'
  try {

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const user = await User.create({email: email, name: name, password: hashedPw})
    res.status(201).json({message: "user costał utworzony", userId: user.dataValues.id})

  } catch(err) {
    if (!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  }

}

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  const email = req.body.email
  const password = req.body.password
  try{
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({where: {email: 'te23123@gmail.com'}})
    console.log(user)
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.dataValues.password)

    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.dataValues.email,
        userId: user.dataValues.id
      },process.env.SECRET_KEY, {expiresIn: '24h'}
    )

    res.status(200).json({token: token, userId: user.dataValues.id.toString()})

  }catch(err){
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)

  }

}