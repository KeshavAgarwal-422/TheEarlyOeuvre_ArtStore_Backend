const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
