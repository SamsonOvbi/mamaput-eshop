'use strict';

const dotenv = require('dotenv');
dotenv.config();
const asyncHandler = require('express-async-handler');
const stripeContr = {};

//Stripe Checkout Implementation
const stripe = require('stripe')(process.env.STRIPE_KEY);

// stripeContr.post('/checkout', async (req, res, next) => {
stripeContr.checkout = async (req, res, next) => {
  try {
    const purchasedItems = req.body.items;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd', },
            display_name: 'Free shipping',
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5, },
              maximum: { unit: 'business_day', value: 7, },
            }
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'usd', },
            display_name: 'Next day air',
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1, },
              maximum: { unit: 'business_day', value: 1, },
            }
          }
        },
      ],
      line_items: purchasedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name, images: [item.product.image] },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',  
      success_url: 'https://mamaput-eshop-1.onrender.com/success.html',
      cancel_url: 'https://mamaput-eshop-1.onrender.com/cancel.html'
    });
    res.status(200).json(session);
  } catch {
    err => next(err);
  }
};

stripeContr.test = asyncHandler(async (req, res) => {
  res.status(200).json({ message1: 'Welcome to stripe/checkout server ' });
});

module.exports = stripeContr;