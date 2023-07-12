const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const orderController = require("../controllers/orderController");

router.get(
  "/user-orders",
  authMiddleware.requireSignIn,
  orderController.getUserOrders
);
router.get(
  "/admin-orders",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  orderController.getAdminOrders
);
router.put(
  "/order-status/:orderId",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  orderController.orderStatusController
);

module.exports = router;
