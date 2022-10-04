const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const fs = require("fs");
const httpError = require("../middleware/error");
const APIfeatures = require("../lib/features");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/mutler");

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
      imgCloudinary: req.body.imgCloudinary,
      statusOnShelves: req.body.statusOnShelves,
      is3D: req.body.is3D,
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
  // product in all furniture
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
        const result = product.filter(
          (item) => item.statusOnShelves === "Active"
        );
        res.status(200).send({
          message: "Get all products successfully",
          data: result,
          pageTotals: pageTotals,
        });
      } else {
        const features = new APIfeatures(productModel.find(), req.query)
          .pagination(pageSize)
          .sorting()
          .searching()
          .filtering();

        product = await features.query;
        const result = product.filter(
          (item) => item.statusOnShelves === "Active"
        );
        res.status(200).send({
          message: "Get all products successfully",
          data: result,
          pageTotals: pageTotal,
        });
      }
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  // product in cate management
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
        statusOnShelves: req.body.statusOnShelves,
        is3D: req.body.is3D,
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
      if (typeof string === "string") {
        const arr = string.split(",");
        updateProduct.color = arr;
      }

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
    try {
      product = await productModel.findById(id);
      switch (typeAction) {
        case "increase":
          if (product.importQuantity > product.exportQuantity) {
            product.exportQuantity = product.exportQuantity + exportQuantity;
          } else {
            product.status = "OUT OF STOCK";
          }
          break;

        case "decrease":
          if (product.importQuantity == product.exportQuantity) {
            product.status = "IN STOCK";
            product.exportQuantity = product.exportQuantity - exportQuantity;
          } else {
            product.exportQuantity = product.exportQuantity - exportQuantity;
          }

          break;
      }
      result = await product.save();
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
  // product in furni sub-cate
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
      const result = productList.filter(
        (item) => item.statusOnShelves === "Active"
      );

      res
        .status(200)
        .send({ message: "Get details successfully", data: result });
    } catch (error) {
      if (productDetails == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  getTopHighestReactInReview: async (req, res) => {
    let productId = req.params.productId;
    let product;
    let result = [];
    try {
      product = await productModel.findById(productId);

      result = product.review.sort((a, b) => {
        if (a.like.length > b.like.length) {
          return -1;
        } else if (a.like.length < b.like.length) {
          return 1;
        } else {
          return 0;
        }
      });
      res.status(200).send({ message: "top like is done", data: result });
    } catch (error) {
      if (product == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  getSortCommentInReview: async (req, res) => {
    let productId = req.params.productId;
    let sortName = req.query.sortName;
    let product;
    let result;
    try {
      product = await productModel.findById(productId);
      if (sortName == "dateCreated") {
        result = product.review.sort((a, b) =>
          a.dateCreated > b.dateCreated
            ? 1
            : b.dateCreated > a.dateCreated
            ? -1
            : 0
        );
      } else {
        result = product.review.sort((a, b) =>
          a.dateCreated > b.dateCreated
            ? -1
            : b.dateCreated > a.dateCreated
            ? 1
            : 0
        );
      }
      res.status(200).send({ message: "sort is done", data: result });
    } catch (error) {
      if (product == null) {
        httpError.notFound(res, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  relatedProduct: async (req, res) => {
    try {
      const product = await productModel.find();
      let result = [];
      for (let i = 0; i <= 4; i++) {
        result[i] = product.pop();
      }
      res.status(200).send({ data: result });
    } catch (error) {
      console.log(error);
    }
  },
  // update three D img
  uploadProductImg3D: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);
      const cloudRes = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "3D_Storage",
      });
      console.log(cloudRes);
      let updateProduct = {
        imgCloudinary: cloudRes.secure_url,
        imgCloudPublicID: cloudRes.public_id,
      };

      const updatedProduct = await productModel.updateOne(
        { _id: id },
        { $set: updateProduct }
      );
      res
        .status(200)
        .send({ message: "3D img is added", data: updatedProduct });
      console.log(updatedProduct);
    } catch (error) {
      console.log(error);
      if (product == null) {
        httpError.notFound(req, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateProductImg3D: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);
      await cloudinary.uploader.destroy(product.imgCloudPublicID);
      
      const cloudRes = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "3D_Storage",
      });
      console.log(cloudRes);
      let updateProduct = {
        imgCloudinary: cloudRes.secure_url,
        imgCloudPublicID: cloudRes.public_id,
      };

      const updatedProduct = await productModel.updateOne(
        { _id: id },
        { $set: updateProduct }
      );
      res
        .status(200)
        .send({ message: "3D img is updated", data: updatedProduct });
      console.log(updatedProduct);
    } catch (error) {
      if (product == null) {
        httpError.notFound(req, error, "product");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  unactivateProductImg3D: async (req, res) => {
    // let id = req.params.id;
    // let product;
    // try {
    //   product = await productModel.findById(id);
    //   await cloudinary.uploader.destroy(product.imgCloudPublicID);
      
    //   const cloudRes = await cloudinary.uploader.upload(req.file.path, {
    //     resource_type: "auto",
    //     folder: "3D_Storage",
    //   });
    //   console.log(cloudRes);
    //   let updateProduct = {
    //     imgCloudinary: cloudRes.secure_url,
    //     imgCloudPublicID: cloudRes.public_id,
    //   };

    //   const updatedProduct = await productModel.updateOne(
    //     { _id: id },
    //     { $set: updateProduct }
    //   );
    //   res
    //     .status(200)
    //     .send({ message: "3D img is updated", data: updatedProduct });
    //   console.log(updatedProduct);
    //   console.log("run");
    // } catch (error) {
    //   if (product == null) {
    //     httpError.notFound(req, error, "product");
    //   } else {
    //     httpError.serverError(res, error);
    //   }
    // }
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

  x = ["fhfgh"];
  if (typeof x != "string") {
    console.log("nice");
  }
  // console.log(typeof x)
};
// run();

module.exports = productController;
