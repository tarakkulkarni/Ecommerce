const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const dotenv = require("dotenv");
dotenv.config();
var braintree = require("braintree");
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !photo:
        return res.status(500).send({ error: "Photo is Required" });
    }
    const product = new Product({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};
const getProductsController = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("-photo")
      .limit(5)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "All products retreived",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting products",
    });
  }
};
const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product retrieved",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product",
    });
  }
};
const getProductPhotoController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product photo",
    });
  }
};
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !photo:
        return res.status(500).send({ error: "Photo is Required" });
    }
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      updateProduct.photo.data = fs.readFileSync(photo.path);
      updateProduct.photo.contentType = photo.type;
    }
    await updateProduct.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      updateProduct,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in deleting product",
    });
  }
};
const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const filtered_products = await Product.find(args);
    res.status(200).send({
      success: true,
      filtered_products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while filtering products",
    });
  }
};
const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in pagination",
    });
  }
};
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products_list = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products_list,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in pagination",
    });
  }
};
const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in search",
    });
  }
};
const similarProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const similar_products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      similar_products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in getting similar products",
    });
  }
};
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send({
          err,
        });
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new Order({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send({
            err,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createProductController,
  getProductsController,
  getSingleProductController,
  getProductPhotoController,
  updateProductController,
  deleteProductController,
  productFilterController,
  productCountController,
  productListController,
  productSearchController,
  similarProductsController,
  braintreeTokenController,
  braintreePaymentController,
};
