const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  artistName: {
    type: String,
    required: [true, "Please enter artist name"],
    trim: true,
  },
  description: {
    desc1: {
      type: String,
      required: [true, "Please enter desc1"],
      trim: true,
    },
    desc2: {
      type: String,
      required: [true, "Please enter desc2"],
      trim: true,
    },
    desc3: {
      type: String,
      required: [true, "Please enter desc3"],
      trim: true,
    },
    desc4: {
      type: String,
      required: [true, "Please enter desc4"],
      trim: true,
    },
    desc5: {
      type: String,
      required: [true, "Please enter desc5"],
      trim: true,
    },
    desc6: {
      type: String,
      required: [true, "Please enter desc6"],
      trim: true,
    },
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  images: {
    imgPrimary: {
      type: String,
      required: [true, "Please enter image url"],
    },
    imgSecondary: {
      img1: { type: String, required: [true, "Please enter imgage url"] },
      img2: { type: String, required: [true, "Please enter imgage url"] },
    },
  },

  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product quantity"],
    default: 1,
  },

  user: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
