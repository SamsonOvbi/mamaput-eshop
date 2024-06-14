// const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/auth.service');
const nodemailer = require("nodemailer");
const { sendEmail } = require('../utils/sendEmail');

const authContr = {}
let statusMessage = '';
authContr.registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body) {
    const message = "data is undefined";
    return res.status(401).send({ status: 'error', message, });
  }
  let userCount = 0;
  userCount = await UserModel.find().countDocuments();
  const tmpName = body.username.split(' ');
  const reqBody = {
    id: userCount + 1,
    email: body.email,
    username: body.username,
    password: bcrypt.hashSync(req.body.password),
    names: { firstname: tmpName[0], lastname: tmpName[tmpName.length - 1], },
    address: {},
    phone: body.phone,
  };
  const newUser = (await UserModel.create(reqBody))
  const { password, ...rest } = newUser._doc;
  statusMessage = 'User registered';
  console.log(statusMessage);
  res.status(200).send({ statusMessage, ...rest, token: generateToken(newUser), });
});


authContr.login = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email }).select("+password");
  if (!user) {
    const message = 'Invalid email or password';
    return res.status(401).send({ message });
  }
  if (await bcrypt.compare(req.body.password, user.password)) {
    const { password, ...rest } = user._doc;
    return res.status(200).send({ message: 'User logged in', ...rest, token: generateToken(user), });
  }
});

authContr.updateProfile = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body) {
    res.send({ status: 'error', message: 'something went wrong! check your sent data', });
  }
  let tmpName = body.username || user.username;
  tmpName = tmpName.split(' ');
  const user = await UserModel.findById(req.user._id).select("+password");
  if (!user) {
    return res.status(404).send({ message: 'User Not Found' });
  }
  user.username = body.username || user.username;
  user.email = body.email || user.email;
  if (req.body.password) {
    user.password = bcrypt.hashSync(req.body.password);
  }
  user.names = { firstname: tmpName[0], lastname: tmpName[tmpName.length - 1], };
  const updatedUser = await user.save();
  const { password, ...rest } = updatedUser._doc;
  res.status(200).send({ ...rest, token: generateToken(updatedUser), });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

authContr.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const message = "data is undefined";
    return res.status(404).send({ status: 'error', message, });
  }
  const user = await UserModel.findOne({ email: req.body.email }).select("+password");
  if (!user) {
    message = "Check your email and send again";
    console.error({ message });
    return res.status(404).send({ message });
  }
  sendEmail(user);
});

authContr.test = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "auth.controller API endpoint", });
})

module.exports = authContr;
