const catchAsyncError = require("../Middleware/catchAsyncError");
const Product = require("../Models/ProductModel");
const apiFeatures = require("../Utils/ApiFeatiures");
const ErrorHandler = require("../Utils/ErrorHandler");

const getAllProducts = catchAsyncError(async (req, res, next) => {
  const apiFeature = new apiFeatures(Product.find(), req.query).search();

  let products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
  });
});

const getFeaturedProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.aggregate([{ $sample: { size: 4 } }]);

  return res.status(200).json({
    success: true,
    products,
  });
});

const getPaintings = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({
    category: { $regex: "painting", $options: "i" },
  });

  return res.status(200).json({
    success: true,
    products,
  });
});

const getDrawings = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({
    category: { $regex: "drawing", $options: "i" },
  });

  return res.status(200).json({
    success: true,
    products,
  });
});

const getSculptures = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({
    category: { $regex: "sculpture", $options: "i" },
  });

  return res.status(200).json({
    success: true,
    products,
  });
});

const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: "desc" });

  return res.status(200).json({
    success: true,
    products,
  });
});

const createNewProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  //http://drive.google.com/uc?export=view&id=
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    success: true,
    newProduct,
  });
});

const getProductDetails = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  let product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.params.productId);

  const result = await Product.deleteOne({ _id: req.params.productId });

  if (result.deletedCount === 0) {
    return next(new ErrorHandler("Product not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

exports.getAllProducts = getAllProducts;
exports.getFeaturedProducts = getFeaturedProducts;
exports.getPaintings = getPaintings;
exports.getDrawings = getDrawings;
exports.getSculptures = getSculptures;
exports.getAdminProducts = getAdminProducts;
exports.createNewProduct = createNewProduct;
exports.updateProduct = updateProduct;
exports.getProductDetails = getProductDetails;
exports.deleteProduct = deleteProduct;
