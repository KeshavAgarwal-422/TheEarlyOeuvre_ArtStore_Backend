const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Please enter address"],
    },
    city: {
      type: String,
      required: [true, "Please enter address"],
    },
    state: {
      type: String,
      required: [true, "Please enter state"],
    },
    country: {
      type: String,
      required: [true, "Please enter country"],
    },
    pinCode: {
      type: Number,
      required: [true, "Please enter pincode"],
      length: 6,
    },
    phoneNo: {
      type: Number,
      required: [true, "Please enter phone number"],
      length: 10,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      _id: false,
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    equired: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
