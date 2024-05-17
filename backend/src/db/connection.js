const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mama-blog';
// const mongoUri = process.env.ATLAS_URI;
mongoose.Promise = global.Promise; 
const options = {
  useNewUrlParser: true, useUnifiedTopology: true
};
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, options);
    console.log(`connected to mongodb: ` + 'successfully');
  } catch (err) {
    console.error(`error connecting to mongodb: `, err);
  }
}

module.exports = connectDB;
  