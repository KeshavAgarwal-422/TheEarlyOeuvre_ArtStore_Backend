const express = require("express");
const orderControllers = require("../Controllers/OrderController");
const isAuthenticatedUser = require("../Middleware/Auth");
const Auth = require("../Middleware/Auth");
const Router = express.Router();

Router.post("/neworder", Auth.isAuthenticatedUser, orderControllers.newOrder);
Router.get("/:id", Auth.isAuthenticatedUser, orderControllers.getSingleOrder);
Router.post("/", Auth.isAuthenticatedUser, orderControllers.myOrders);
Router.get(
  "/",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  orderControllers.getAllOrders
);
Router.put(
  "/admin/:id",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  orderControllers.updateOrder
);
Router.delete(
  "/admin/:orderId",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  orderControllers.deleteOrder
);

module.exports = Router;
