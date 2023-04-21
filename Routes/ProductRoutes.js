const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductController");
const Auth = require("../Middleware/Auth");

router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/paintings", productController.getPaintings);
router.get("/drawings", productController.getDrawings);
router.get("/sculptures", productController.getSculptures);
router.get("/:id", productController.getProductDetails);

router.post(
  "/admin",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  productController.getAdminProducts
);
router.post(
  "/admin/newproduct",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  productController.createNewProduct
);
router.put(
  "/admin/:id",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  productController.updateProduct
);
router.delete(
  "/admin/:productId",
  Auth.isAuthenticatedUser,
  Auth.authorizedRoles("admin"),
  productController.deleteProduct
);

module.exports = router;
