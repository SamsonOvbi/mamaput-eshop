'use strict';

const express = require('express');

// Load models
const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const UserModel = require('../models/user.model');

const dBaseSeed = express.Router();

// Populate database with JSON data: 
// dBaseSeed.post('/populate-database', async (req, res, next) => {
dBaseSeed.get('/populate-database', async (req, res) => {

  const productData = require('./data/products.json');
  const userData = require('./data/user.data.js');
  // const orderData = require('./data/orders.json');

  try {
    // const orderSearch = await OrderModel.find();
    const productSearch = await ProductModel.find();
    const userSearch = await UserModel.find();

    let resultStr = '';
    const msg = 'collection occupied';
    // (orderSearch.length === 0) ? await OrderModel.create(orderData) : resultStr += ` Order ${msg} \n `;
    (productSearch.length === 0) ? await ProductModel.create(productData) : resultStr += ` Product ${msg} \n `;
    (userSearch.length === 0) ? await UserModel.create(userData) : resultStr += ` User ${msg} `;
    if (resultStr) return res.send({ resultStr });

    res.send('Data Imported into db...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/read-database', async (req, res) => {
  let orderData, productData, userData;

  try {
    orderData = await OrderModel.find();
    productData = await ProductModel.find();
    userData = await UserModel.find();

    const readings = { orderData, productData, userData }
    console.log('Data read from database...', readings.productData);
    res.json({ userData });

  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.post('/delete-database', async (req, res) => {
  // dBaseSeed.get('/delete-database', async (req, res) => {
  try {
    // await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    // await UserModel.deleteMany();
    const message = `OrderModel Data Destroyed...`
    console.log(message);
    res.json(message);
  } catch (err) {
    console.error(err);
  }
});

// dBaseSeed.post('/delete-orders-except-last-twelve', async (req, res) => {
dBaseSeed.get('/delete-orders-except-last-twelve', async (req, res) => {
  try {
    // Find the last 12 orders based on creation date
    const lastTwelveOrders = await OrderModel.find().sort({ createdAt: -1 }).limit(12);

    // Extract the ids of the last 12 orders
    const lastTwelveIds = lastTwelveOrders.map(order => order._id);

    // Delete all orders except the last 12
    await OrderModel.deleteMany({ _id: { $nin: lastTwelveIds } });

    res.send({ message: 'All orders except the last twelve have been deleted' });
  } catch (error) {
    console.error('Error occurred while deleting orders: ', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder endpoint'));

module.exports = dBaseSeed;
