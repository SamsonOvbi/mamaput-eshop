'use_strict'

const express = require('express');
// const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const { isAuth } = require('../services/auth.service');
const stripeContr = require('../controller/payStripe.controller');
const paypalContr = require('../controller/payPaypal.controller');

dotenv.config();
// const ProductModel = require('../db/models/product.model');

const paymentRoute = express.Router();

paymentRoute.get('/paypal', isAuth, paypalContr.checkout);
paymentRoute.get('/paypal/test', paypalContr.test);

paymentRoute.post('/stripe', isAuth, stripeContr.checkout);
paymentRoute.get('/stripe/test', paypalContr.test);

paymentRoute.get('/test', (req, res) => {
  res.send({ message: 'Welcome to payment api endpoint' });
});

module.exports = paymentRoute;
