const express = require("express");
const userController = require("../Controllers/UserController");
const Auth = require("../Middleware/Auth");

const Router = express.Router();

Router.post("/signup", userController.signUp);
Router.post("/login", userController.login);
Router.post("/forgotPassword", userController.forgetPassword);
Router.put("/resetpassword/:token", userController.resetPassword);

Router.get("/logout", userController.logout);
Router.get(
  "/mydetails",
  Auth.isAuthenticatedUser,
  userController.getUserDetails
);
Router.put(
  "/update/profile",
  Auth.isAuthenticatedUser,
  userController.updateProfile
);

Router.put(
  "/update/password",
  Auth.isAuthenticatedUser,
  userController.updatePassword
);

Router.get(
  "/admin",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  userController.getAllUsers
);

Router.get(
  "/admin/:userId",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  userController.getSingleUser
);
Router.put(
  "/admin/:userId",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  userController.updateUserRole
);
Router.delete(
  "/admin/:userId",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  userController.deleteUser
);

module.exports = Router;
