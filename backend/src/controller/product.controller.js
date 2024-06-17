const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/product.model");

const productContr = {};

productContr.getAllProducts = asyncHandler(async (req, res) => {
  if (!req.query) {
    const message = "query is undefined";
    return res.status(401).send({ status: 'error', message, });
  }
  const name = (req.query.name || '');
  const description = (req.query.description || '');
  const category = (req.query.category || '');
  const pageSize = Number(req.query.pageSize) || 0;
  // const sort = req.query.sort === 'desc' ? -1 : 1;
  const sort = (req.query.sort || '');
  const min = req.query.minValue && Number(req.query.minValue) !== 0 ? Number(req.query.minValue) : 1;
  const max = req.query.maxValue && Number(req.query.maxValue) !== 0 ? Number(req.query.maxValue) : 2100;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const descriptionFilter = name ? { name: { $regex: description, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  const sortOrder = sort === 'lowest' ? { price: 1 } : sort === 'highest' ? { price: -1 } : sort === 'toprated'
    ? { rating: -1 } : sort === 'a-z' ? { name: 1 } : sort === 'z-a' ? { name: -1 } : { _id: -1 };
  // const count = await ProductModel.count({
  //   ...nameFilter, ...descriptionFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  // });
  const products = await ProductModel.find({
    ...nameFilter, ...descriptionFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    // .select(['-_id']).limit(pageSize);
    .limit(pageSize)
    // .sort({ id: sort })
    .sort(sortOrder)
  return res.status(200).send(products);
});

productContr.getPagedProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 5;
  const page = Number(req.query.pageNumber) || 1;
  const name = (req.query.name || '');
  const description = (req.query.description || '');
  const category = (req.query.category || '');
  const sort = (req.query.sort || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const descriptionFilter = name ? { name: { $regex: description, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder = sort === 'lowest' ? { price: 1 } : sort === 'highest' ? { price: -1 } : sort === 'toprated'
    ? { rating: -1 } : { _id: -1 };
  const count = await ProductModel.count({
    ...nameFilter, ...descriptionFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  });
  const products = await ProductModel.find({
    ...nameFilter, ...descriptionFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ products, page, count, pages: Math.ceil(count / pageSize) });
});

productContr.getProductCategories = asyncHandler(async (req, res) => {
  const categories = await ProductModel.find().distinct('category');
  res.send(categories);
});

productContr.getProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await ProductModel.findOne({ slug: req.params.slug, });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.getProductsInCategory = asyncHandler(async (req, res) => {
  const category = req.params.category || 'jewelry';
  const pageSize = Number(req.query.pageSize) || 0;
  const sort = req.query.sort === 'desc' ? -1 : 1;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 1;

  const categoryFilter = category ? category : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  console.log("categoryFilter: "); console.log(categoryFilter);
  console.log("ratingFilter: "); console.log(ratingFilter);
  const product = await ProductModel.find({ ...categoryFilter, ...ratingFilter }).select(['-_id'])
    .limit(pageSize)
    .sort({ _id: sort })
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.addProduct = asyncHandler(async (req, res) => {
  let productCount = await ProductModel.find().countDocuments();
  const product = await ProductModel.create({
    // id: (req.body.id || 21),
    id: (req.body.id || productCount),
    name: (req.body.name || 'sample name ') + Date.now(),
    image: req.body.image || '../assets/images/p1.jpg',
    price: req.body.price || 0,
    slug: (req.body.slug || 'sample-slug') + '-' + Date.now(),
    category: req.body.category || 'sample category',
    brand: (req.body.brand || 'sample brand'),
    countInStock: req.body.countInStock || 0,
    rating: req.body.rating || 0,
    numReviews: req.body.numReviews || 0,
    description: (req.body.price || 'sample description'),
  });

  res.send(product);
});

productContr.editProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    res.send({ message: 'Product Updated', product: updatedProduct });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    const deleteProduct = await product.remove();
    res.send({ message: 'Product Deleted', product: deleteProduct });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.writeReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  if (product) {
    if (product.reviews.find((x) => x.username === req.user.username)) {
      res.status(400).send({ message: 'You already submitted a review' });
      return;
    }
    const review = {
      username: req.user.username,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.test = asyncHandler(async (req, res) => {
  res.send({ message: 'Welcome to product api endpoint' });
});

module.exports = productContr;
