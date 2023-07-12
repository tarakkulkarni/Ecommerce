const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.get(
  "/test",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  authController.testController
);
//protected route
router.get("/user-auth", authMiddleware.requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get(
  "/admin-auth",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  (req, res) => {
    res.status(200).send({ ok: true });
  }
);
router.put(
  "/profile",
  authMiddleware.requireSignIn,
  authController.updateProfielController
);
module.exports = router;
