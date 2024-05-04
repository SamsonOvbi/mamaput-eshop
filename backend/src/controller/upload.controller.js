"use strict";


const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const asyncHandler = require('express-async-handler');
const uploadContr = {};

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

uploadContr.uploadSingleImageToCloudinary = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file provided.");
  }

  try {
    const result = await uploadImage(req.file);
    res.send(result);
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).send("An error occurred during the image upload.");
  }
});

const uploadImage = (file) => {
  const originalName = file.originalname;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: `mama_blog/${originalName}`, // Using original filename as public_id
        use_filename: true,
        unique_filename: false,
        timeout: 120000
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readStream = streamifier.createReadStream(file.buffer);
    readStream.on('error', (error) => {
      console.error("Stream error:", error);
      reject(error);
    });

    readStream.pipe(stream);
  });
};

uploadContr.uploadSingleImageToStorage = asyncHandler(async (req, res) => {
  res.send({ image: `/${req.file.path}` });
});

uploadContr.uploadImagesToCloudinary = asyncHandler(async (req, res) => {
  try {
    const directoryPath = path.join(__dirname, '../public');
    const files = await fs.promises.readdir(directoryPath); // Using promises to handle async operations
    for (const file of files) { // Make sure to handle each file upload sequentially
      const originalName = file.originalname;
      let filePath = path.join(directoryPath, file);
      if (path.extname(file).match(/\.(jpg|jpeg|png|gif)$/)) {
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'image',
            public_id: `mama_blog/${originalName}`, // Using original filename as public_id
            use_filename: true,
            unique_filename: false,
            timeout: 120000
          });
          console.log('Upload successful:', result);
          res.send(result);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          res.status(500).send("An error occurred during the image upload.", uploadError);
        }
      } else {
        throw new Error('Invalid file type. Only image files are allowed.');
      }
    }
  } catch (err) {
    console.error('Error getting directory information or uploading files:', err);
  }
});

module.exports = uploadContr;
