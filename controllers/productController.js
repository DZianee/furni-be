const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const fs = require("fs");
const httpError = require("../middleware/error");

const productController = {
  newProduct: async (req, res) => {
    let newProduct = new productModel({
      name: req.body.name,
      code: req.body.code,
      price: req.body.price,
      importQuantity: req.body.importQuantity,
      color: req.body.color,
      status: req.body.status,
      type: req.body.type,
      description: req.body.description,
      about: req.body.about,
      technicalInfo: {
        width: req.body.width,
        height: req.body.height,
        depth: req.body.depth,
        length: req.body.length,
      },
      category: req.body.category,
      review: req.body.review,
      productImg: req.body.productImg,
    });
    try {
      const imageName = req.file.filename;
      newProduct.productImg = imageName;

      const saveProduct = await newProduct.save();
      if (req.body.category) {
        // const test = await productModel.countDocuments({
        //   category: req.body.category,
        // });
        // await categoryModel.updateOne({ $set: { inStock: test } });
        const category = categoryModel.findById(req.body.category);
        await category.updateOne({ $push: { productList: saveProduct._id } });
      }

      res.status(200).send({
        message: "Create new product successfully",
        data: saveProduct,
      });
    } catch (error) {
      if (error.name == "ValidationError") {
        httpError.badRequest(res, error);
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const getAllProducts = await productModel.find();
      const totalProducts = await productModel.countDocuments();
      res.status(200).send({
        message: "Get all product successfully",
        data: getAllProducts,
        totalProducts: totalProducts,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getProductDetails: async (req, res) => {
    let id = req.params.id;
    let productDetails;
    try {
      productDetails = await productModel.findById(id);
      res
        .status(200)
        .send({ message: "Get details successfully", data: productDetails });
    } catch (error) {
      if (productDetails == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateProduct: async (req, res) => {
    let id = req.params.id;
    let product;
    let newImg;

    try {
      product = await productModel.findById(id);
      console.log(product);
      let updateProduct = {
        name: req.body.name,
        code: req.body.code,
        price: req.body.price,
        importQuantity: req.body.importQuantity,
        color: req.body.color,
        status: req.body.status,
        type: req.body.type,
        description: req.body.description,
        about: req.body.about,
        width: req.body.width,
        height: req.body.height,
        depth: req.body.depth,
        length: req.body.length,
        category: req.body.category,
        review: req.body.review,
        productImg: req.body.productImg,
      };
      if (req.file) {
        newImg = req.file.filename;
        try {
          fs.unlinkSync("./resource/img/uploads/" + product.productImg);
        } catch (error) {
          console.log(error);
        }
      } else {
        newImg = product.productImg;
      }
      updateProduct.productImg = newImg;
      const updatedProduct = await productModel.updateOne(
        { _id: id },
        { $set: updateProduct }
      );
      console.log(updatedProduct);
    } catch (error) {
      if (product == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  deleteProduct: async (req, res, next) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);

      // remove product from cate
      const category = categoryModel.find({ productList: id });
      const removeProductFromCate = await category.updateMany(category, {
        $pull: { productList: id },
      });

      const removeProduct = await productModel.findByIdAndDelete(id);
      if (removeProduct.productImg != "") {
        try {
          fs.unlinkSync("./resource/img/uploads/" + removeProduct.productImg);
        } catch (error) {
          console.log(error);
        }
      }
      res.status(200).send({ message: "Remove successfully" });
    } catch (error) {
      if (product == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

module.exports = productController;
