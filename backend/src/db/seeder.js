'use strict';

const express = require('express');

// Load models
const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const UserModel = require('../models/user.model');
const CartModel = require('../models/cart.model.js');

const dBaseSeed = express.Router();

// Populate database with JSON data: 
dBaseSeed.post('/populate-database', async (req, res) => {
  // dBaseSeed.get('/populate-database', async (req, res) => {

  // const bookData = require('./data/books.json');
  const productData = require('./data/products.json');
  // const roleData = require('./data/roles.json');
  // const userData = require('./data/user.data.js');
  // const fakerStoreData = require('./data/faker-store.json');
  // const orderData = require('./data/orders.json');
  // const cartData = require('./data/carts.json');

  try {
    // await ProductModel.create(bookData);
    await ProductModel.create(productData);
    // await RoleModel.create(rollData);
    // await UserModel.create(userData);
    // await OrderModel.create(orderData);
    // await CartModel.create(cartData);

    res.send('Data Imported into db...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/read-database', async (req, res) => {
  let cartData, orderData, productData, userData;

  try {
    orderData = await OrderModel.find();
    cartData = await CartModel.find();
    productData = await ProductModel.find();
    userData = await UserModel.find();

    const readings = { orderData, cartData, productData, userData }
    console.log('Data read from database...', readings.productData);
    res.json({ orderData });
    // res.json(readings.orderData, readings.productData, readings.userData, readings.cartData);

  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.post('/delete-database', async (req, res) => {
  // dBaseSeed.get('/delete-database', async (req, res) => {
  try {
    // await CartModel.deleteMany();
    // await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    // await RoleModel.deleteMany();
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
