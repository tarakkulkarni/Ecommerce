const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");
const formidable = require("express-formidable");

router.post(
  "/create-product",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  formidable(),
  productController.createProductController
);
router.get("/get-products", productController.getProductsController);
router.get("/get-product/:slug", productController.getSingleProductController);
router.get("/product-photo/:id", productController.getProductPhotoController);
router.put(
  "/update-product/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  formidable(),
  productController.updateProductController
);
router.delete(
  "/delete-product/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  productController.deleteProductController
);

router.post("/filter-products", productController.productFilterController);
router.get("/product-count", productController.productCountController);
router.get("/product-list/:page", productController.productListController);
router.get("/search/:keyword", productController.productSearchController);
router.get(
  "/similar-product/:pid/:cid",
  productController.similarProductsController
);
router.get("/braintree/token", productController.braintreeTokenController);
router.post(
  "/braintree/payment",
  authMiddleware.requireSignIn,
  productController.braintreePaymentController
);
module.exports = router;
