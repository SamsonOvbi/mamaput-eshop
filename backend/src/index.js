"use strict";

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const helmet = require('helmet');
const morgan = require("morgan");
// const colors = require("colors");
const fs = require("fs");
const path = require('path');
const connectDB = require('./db/connection');
const dBaseSeed = require('./db/seeder');
const uploadRoute = require('./routes/upload.routes');
const userRoute = require('./routes/user.routes');
const productRoute = require('./routes/product.routes');
const orderRoute = require('./routes/order.routes');
const paymentRoute = require('./routes/payment.routes');
const authRoute = require('./routes/auth.routes');
const mapRoute = require('./routes/map.routes');
const rateLimiter = require('./middleware/rate-limiter');
const startKeepAliveCron = require('./utils/keep-alive-cron');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cors());
const angularUri = process.env.ANGULAR_URI;
const projectUri = process.env.PROJECT_URI;
const allowedOrigins = [
  'http://localhost:4204', angularUri, 
  'https://mamaput-eshop-1.onrender.com', projectUri,
];
app.use(
  cors({ credentials: true, origin: allowedOrigins, })
);

connectDB();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

orderRoute.use(helmet());
app.use('/api/seeder', dBaseSeed);
app.use('/api/uploads', uploadRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', paymentRoute);
app.use('/api/config', mapRoute);

app.use(express.static(path.join(__dirname, './public')));
// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend/dist/frontend')));
// Catch-all handler for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/index.html'));
});

startKeepAliveCron();
app.use(rateLimiter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started on port http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  console.log({ message: err.message })
  res.status(500).send({ message: err.message });
  next(); 
});
