const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const httpError = require("../middleware/error");
const APIfeatures = require("../lib/features");

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
        data: {
          content: getAll,
          total: total,
        },
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
        .populate(
          "productList",
          "name code type price status productImg category"
        );
      const totalProduct = getDetails.productList.length;

      res.status(200).send({
        message: "Get details successfully",
        data: {
          content: getDetails,
          totalProduct: totalProduct,
        },
      });
    } catch (error) {
      if (getDetails == null) {
        httpError.notFound(res, error, "category");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  // getProductsByCateName: async (req, res) => {
  //   let getDetails;
  //   let getAll;
  //   try {
  //     getDetails = await categoryModel
  //       .findById(req.params.id)
  //       .populate(
  //         "productList",
  //         "name code type price status productImg category"
  //       );
  //     let product = getDetails.productList;
      
  //     console.log(product)
  //     if (req.query.search != "") {
  //       const feature = new APIfeatures(product, req.query)
  //         .sorting()
  //         .searching()
  //         .filtering();

  //       getAll = await feature.query;
  //       res.status(200).send({
  //         message: "Get details successfully",
  //         content: getAll,
  //       });
  //     } else {
  //       console.log(product)
  //       const features = new APIfeatures(product, req.query)
  //         .sorting()
  //         .searching()
  //         .filtering();

  //       getAll = await features.query;
  //       console.log(getAll);
  //       res.status(200).send({
  //         message: "Get details successfully",
  //         content: getAll,
  //       });
  //     }
  //     console.log(getAll);
  //   } catch (error) {
  //     if (getDetails == null) {
  //       httpError.notFound(res, error, "category");
  //     } else {
  //       httpError.serverError(res, error);
  //       console.log(error.message)
  //     }
  //   }
  // },
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
  checkProduct: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.find({ category: id });
      console.log(product);
      if (product == "") {
        res.status(202).send({ message: "Available to delete" });
      } else {
        res.status(200).send({
          message:
            "This category is being used, you are not allowed to remove it.",
          data: product,
        });
      }
    } catch (err) {
      httpError.serverError(res, error);
    }
  },
  deleteCate: async (req, res) => {
    let cate;
    let id = req.params.id;
    try {
      cate = await categoryModel.findById(id);
      const deleteCate = await categoryModel.findOneAndDelete({ _id: id });
      res.status(200).send({ data: deleteCate });
    } catch (error) {
      if (cate == null) {
        httpError.notFound(res, error, "category");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

const test = () => {
  const arr = [
    { name: "Test ver 1", type: "Chair" },
    { name: "Test ver 2", type: "Armchair" },
    { name: "Test ver 3", type: "Armchair" },
  ];
  const mapping = arr.map((item) => item.type);
  console.log(mapping);
  if (mapping.length > 1) {
    var unique = [...new Set(mapping)];
    console.log(unique);
  }
  // const count = arr.filter((item) => item === type);
  // console.log(count)
  // const x1 = ["Chao", "Ne", "Chao"].toString();
  // const x = "Chao";
  // console.log(x1.length);
  // const y = x1.
};
test();
module.exports = categoryController;
