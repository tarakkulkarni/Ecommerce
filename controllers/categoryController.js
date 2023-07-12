const Category = require("../models/category");
const slugify = require("slugify");
const dotenv = require("dotenv");
dotenv.config();

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "Name is required",
      });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating category",
    });
  }
};
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated sucessfully",
      updateCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating category",
    });
  }
};
const getCategoryController = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).send({
      success: true,
      message: "All categories retreived",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting categories",
    });
  }
};
const getSingleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    res.status(200).send({
      success: true,
      message: "Single category retrieved",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting category",
    });
  }
};
const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in deleting category",
    });
  }
};
module.exports = {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  getSingleCategoryController,
  deleteCategoryController,
};
