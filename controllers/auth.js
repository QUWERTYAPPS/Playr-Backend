require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, name, password, status, birthDate, phoneNumber,address} = req.body;
  // const email = req.body.email;
  // const name = req.body.name || "test";
  // const password = req.body.password || "test";
  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      name,
      password: hashedPw,
      status: "user",
      birthDate,
      phoneNumber,
      address
    });
    res
      .status(201)
      .json({ message: "user costał utworzony", userId: user.dataValues.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.dataValues.password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.dataValues.id,
        email: user.dataValues.id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({ token: token, userId: user.dataValues.id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId)
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findByPk(req.userId)
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'User updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
