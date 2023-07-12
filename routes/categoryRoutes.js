const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

router.post(
  "/create-category",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  categoryController.createCategoryController
);
router.put(
  "/update-category/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  categoryController.updateCategoryController
);
router.get("/get-categories", categoryController.getCategoryController);
router.get(
  "/get-category/:slug",
  categoryController.getSingleCategoryController
);
router.delete(
  "/delete-category/:id",
  authMiddleware.requireSignIn,
  authMiddleware.isAdmin,
  categoryController.deleteCategoryController
);
module.exports = router;
