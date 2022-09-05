const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const fs = require("fs");
const httpError = require("../middleware/error");
const APIfeatures = require("../lib/features");

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

      const string = req.body.color;
      const arr = string.split(",");
      newProduct.color = arr;
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
  getAll: async (req, res) => {
    let product;
    try {
      const pageSize = 6;
      const pageTotal =
        Math.ceil((await productModel.find()).length / pageSize) || 1;
      let pageTotals;
      if (req.query.search != "") {
        const feature = new APIfeatures(productModel.find(), req.query)
          .sorting()
          .searching()
          .filtering();

        product = await feature.query;
        pageTotals = Math.ceil(product.length / pageSize) || 1;

        const features = new APIfeatures(productModel.find(), req.query)
          .pagination(pageSize)
          .sorting()
          .searching()
          .filtering();

        product = await features.query;
        res.status(200).send({
          message: "Get all products successfully",
          data: product,
          pageTotals: pageTotals,
        });
      } else {
        const features = new APIfeatures(productModel.find(), req.query)
          .pagination(pageSize)
          .sorting()
          .searching()
          .filtering();

        product = await features.query;

        res.status(200).send({
          message: "Get all products successfully",
          data: product,
          pageTotals: pageTotal,
        });
      }
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getAllProducts: async (req, res) => {
    let cateId = req.params.categoryId;
    let getAll;
    try {
      const pageSize = 6;
      const pageTotal =
        Math.ceil(
          (await productModel.find({ category: cateId })).length / pageSize
        ) || 1;
      const totalProducts = await (
        await productModel.find({ category: cateId })
      ).length;
      let pageTotals;
      if (req.query.search != "") {
        const feature = new APIfeatures(
          productModel.find({ category: cateId }),
          req.query
        )
          .sorting()
          .searching()
          .filtering();

        getAll = await feature.query;
        pageTotals = Math.ceil(getAll.length / pageSize) || 1;

        const features = new APIfeatures(
          productModel.find({ category: cateId }),
          req.query
        )
          .pagination(pageSize)
          .sorting()
          .searching()
          .filtering();

        getAll = await features.query;
        res.status(200).send({
          message: "Get all products successfully",
          data: getAll,
          pageTotals: pageTotals,
          totalProducts: totalProducts,
        });
      } else {
        const features = new APIfeatures(
          productModel.find({ category: cateId }),
          req.query
        )
          .pagination(pageSize)
          .sorting()
          .searching()
          .filtering();

        getAll = await features.query;

        res.status(200).send({
          message: "Get all products successfully",
          data: getAll,
          pageTotals: pageTotal,
          totalProducts: totalProducts,
        });
      }
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
  getReviewsPerUser: async (req, res) => {
    let user = req.params.userId;
    let productDetails;
    try {
      console.log(user);
      productDetails = await productModel.find();

      const arr = productDetails.filter((item) => item.review != "");
      const subject = arr[0].review;
      const review = await subject.filter((item) => item.user == user);
      console.log(review);

      res.status(200).send({
        message: "Get details successfully",
        data: review,
        arrProduct: arr,
      });
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

      const string = req.body.color;
      const arr = string.split(",");
      updateProduct.color = arr;

      if (product.status == "OUT OF STOCK") {
        if (updateProduct.importQuantity > product.importQuantity) {
          updateProduct.status = "IN STOCK";
        } else {
          updateProduct.status = "IN STOCK";
        }
      }

      const updatedProduct = await productModel.updateOne(
        { _id: id },
        { $set: updateProduct }
      );

      res.status(200);
      console.log(updatedProduct);
    } catch (error) {
      if (product == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateExportQuantity: async (req, res) => {
    let product;
    let id = req.params.id;
    let exportQuantity = req.body.exportQuantity;
    let typeAction = req.body.type;
    let result;
    console.log(id);
    try {
      product = await productModel.findById(id);
      if (typeAction == "increase") {
        product.exportQuantity = product.exportQuantity + exportQuantity;
      } else {
        product.exportQuantity = product.exportQuantity - exportQuantity;
      }
      await product.save();

      product = await productModel.findById(id);
      if (product.importQuantity > product.exportQuantity) {
        product.status = "IN STOCK";
        result = await product.save();
      } else if (product.importQuantity == product.exportQuantity) {
        product.status = "OUT OF STOCK";
        result = await product.save();
      }

      res.status(200).send({ message: "check in stock already", data: result });
    } catch (error) {
      if (product == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateProductInStock: async (req, res) => {
    let result;
    let id = req.params.id;
    try {
      const product = await productModel.findById(id);
      if (product.importQuantity > product.exportQuantity) {
        product.status = "IN STOCK";
        result = await product.save();
      } else if (product.importQuantity == product.exportQuantity) {
        product.status = "OUT OF STOCK";
        result = await product.save();
      }
      console.log(result);

      res.status(200).send({ message: "check in stock already", data: result });
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
  getProductByCateName: async (req, res) => {
    let id = req.params.cateId;
    let productDetails;
    let productList;
    try {
      productDetails = await productModel.find({ category: id });
      console.log(productDetails);
      if (req.query.search != "") {
        const feature = new APIfeatures(
          productModel.find({ category: id }),
          req.query
        )
          .sorting()
          .searching()
          .filtering();

        productList = await feature.query;
      } else {
        const features = new APIfeatures(
          productModel.find({ category: id }),
          req.query
        )
          .sorting()
          .filtering();

        productList = await features.query;
      }
      res
        .status(200)
        .send({ message: "Get details successfully", data: productList });
    } catch (error) {
      if (productDetails == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

const run = () => {
  // const test = "test,test-ver1";
  // console.log(test);
  // console.log(typeof test);
  // const arr = [];

  // const x = test.split(",");
  // console.log(x);

  const arr = ["a", "b", "cd"];
  const col = ["a", "c", "kl"];

  var intersection = arr.filter(function (item) {
    return !col.includes(item);
  });
  console.log(intersection);
  const date = new Date(Date.now());
  console.log(date.getUTCFullYear());
};
// run();

module.exports = productController;
