const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel")
const httpError = require("../middleware/error");

const categoryController = {
  newCate: async (req, res) => {
    const category = new categoryModel({
      code: req.body.code,
      name: req.body.name,
      inStock: req.body.inStock,
      productList: req.body.productList,
    });
    try {
      const newCate = await category.save();
      res
        .status(200)
        .send({ message: "New category is created", data: newCate });
    } catch (error) {
      if (error.name == "ValidationError") {
        httpError.badRequest(res, error);
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  getAll: async (req, res) => {
    try {
      const getAll = await categoryModel.find();
      res
        .status(200)
        .send({ message: "Get all categories successfully", data: getAll });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getDetails: async (req, res) => {
    let getDetails;
    try {
      getDetails = await categoryModel.find({ _id: req.params.id });
      res
        .status(200)
        .send({ message: "Get details successfully", data: getDetails });
    } catch (error) {
      if (getDetails == null) {
        httpError
          .notFound(res)
          .send({ message: "This category is not existed" });
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateCate: async (req, res) => {
    let getDetails;
    try {
      getDetails = await categoryModel.find({ _id: req.params.id });

      let cate = {
        code: req.body.code,
        name: req.body.name,
        inStock: req.body.inStock,
      };
      const updateCate = await categoryModel.updateOne(
        { _id: req.params.id },
        { $set: cate }
      );
      res
        .status(200)
        .send({ message: "Update category successfully", data: cate });
    } catch (error) {
      if (getDetails == null) {
        httpError
          .notFound(res)
          .send({ message: "This category is not existed" });
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  deleteCate: async (req, res) => {
    let cate;
    try {
      cate = await categoryModel.find({ _id: req.params.id });

      const product = await productModel.find({ category: req.params.id })
      if (product) {
        httpError.badRequest.send({
          message: "This category is being used, you are not allowed to remove it.",
        });
      }
      const removeCate = await categoryModel.deleteOne({ _id: req.params.id });
      res.status(200).send({ message: "Delete is done", data: removeCate });
    } catch (error) {
      if (cate == null) {
        httpError
          .notFound(res)
          .send({ message: "This category is not existed" });
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

module.exports = categoryController;
