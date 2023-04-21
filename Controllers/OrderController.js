const catchAsyncError = require("../Middleware/catchAsyncError");

const Order = require("../Models/OrderModel");
const Product = require("../Models/ProductModel");
const ErrorHandler = require("../Utils/ErrorHandler");

const newOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.create({
    ...req.body.order,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});

const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//admin

const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: "desc" });

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }

  const { status } = req.body;
  order.orderStatus = status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order: order,
  });
});

const deleteOrder = catchAsyncError(async (req, res, next) => {
  const result = await Order.deleteOne({ _id: req.params.orderId });

  if (result.deletedCount === 0) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

exports.newOrder = newOrder;
exports.getSingleOrder = getSingleOrder;
exports.myOrders = myOrders;
exports.getAllOrders = getAllOrders;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
