require("dotenv").config();
const crypto = require("crypto");
const RazorPay = require("razorpay");
const Payment = require("../Models/PaymentModel.js");
const catchAsyncError = require("../Middleware/catchAsyncError");

const getKey = catchAsyncError(async (req, res) => {
  return res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_API_KEY,
  });
});

const checkout = catchAsyncError(async (req, res, next) => {
  const instance = new RazorPay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const options = {
    amount: Number(req.body.totalPrice * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
});

const paymentVerification = catchAsyncError(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpaySignature;

  if (isAuthentic) {
    await Payment.create({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return res.status(200).json({
      success: true,
      msg: "Successfull",
      id: razorpayPaymentId,
    });
  } else {
    return res.status(400).json({
      success: false,
      msg: "Failed",
      id: razorpayPaymentId,
    });
  }
});

exports.paymentVerification = paymentVerification;
exports.checkout = checkout;
exports.getKey = getKey;
