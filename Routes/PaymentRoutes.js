const express = require("express");
const paymentController = require("../Controllers/PaymentController");
const Router = express.Router();
const isAuthenticatedUser = require("../Middleware/Auth");

Router.get("/getkey", paymentController.getKey);

Router.post("/checkout", paymentController.checkout);

Router.post("/paymentverification", paymentController.paymentVerification);

module.exports = Router;
