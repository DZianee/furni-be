const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const httpError = require("../middleware/error");

const categoryController = {
  newCate: async (req, res) => {
    const category = new categoryModel({
      code: req.body.code,
      name: req.body.name,
      productList: req.body.productList,
    });
    try {
      const newCate = await category.save();

      res.status(200).send({
        message: "New category is created",
        data: newCate,
      });
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

      //get length of productList array
      const total = await categoryModel.aggregate([
        {
          $project: { inStock: { $size: "$productList" } },
        },
      ]);

      res.status(200).send({
        message: "Get all categories successfully",
        data: getAll,
        total: total,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getDetails: async (req, res) => {
    let getDetails;
    try {
      getDetails = await categoryModel
        .findById(req.params.id)
        .populate("productList", "name code type");
      const total = await categoryModel.aggregate([
        {
          $project: { inStock: { $size: "$productList" } },
        },
      ]);

      res.status(200).send({
        message: "Get details successfully",
        data: getDetails,
        total: total,
      });
    } catch (error) {
      if (getDetails == null) {
        httpError.notFound(res, error, "category");
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
        httpError.notFound(res, error, "category");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  deleteCate: async (req, res) => {
    let cate;
    try {
      cate = await categoryModel.find({ _id: req.params.id });

      const product = await productModel.find({ category: req.params.id });
      if (product === []) {
        res.status(400).send({
          message:
            "This category is being used, you are not allowed to remove it.",
        });
      } else {
        categoryModel.deleteOne(
          {
            _id: req.params.id,
          },
          () => {
            console.log("delete successfully");
          }
        );
      }
    } catch (error) {
      if (cate == null) {
        httpError.notFound(res, error, "category");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

module.exports = categoryController;
