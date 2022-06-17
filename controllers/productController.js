const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const httpError = require("../middleware/error");

const productController = {
  newProduct: async (req, res) => {
    const newProduct = new productModel({
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
      //   review: req.body.review,
    });
    try {
      const saveProduct = await newProduct.save();
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
      res.status(200).send({
        message: "Get all product successfully",
        data: getAllProducts,
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
        httpError
          .notFound(res)
          .send({ message: "This product is not existed" });
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateProduct: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);

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
      };
      const updatedProduct = await productModel.updateOne(
        { _id: id },
        { $set: updateProduct }
      );
    } catch (error) {
      if (product == null) {
        httpError
          .notFound(res)
          .send({ message: "This product is not existed" });
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  deleteProduct: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);

      const category = await categoryModel.find({ productlist: id });
      const removeProductFromCate = await category.updateMany(category, {
        $pull: { productlist: req.params.id },
      });
      console.log(removeProductFromCate);

      const removeProduct = await productModel.deleteOne({ _id: id });
      res
        .status(200)
        .send({ message: "Remove successfully", data: removeProduct });
    } catch (error) {
      if (product == null) {
        httpError
          .notFound(res)
          .send({ message: "This product is not existed" });
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

module.exports = productController;
