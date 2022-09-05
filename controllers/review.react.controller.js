const productModel = require("../models/productModel");
const httpErrors = require("../middleware/error");

const productReviewController = {
  addReact: async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    let product;
    let review;
    try {
      product = await productModel.findById(id);
      review = product.review.id(reviewId);

      const reviewReact = {
        like: req.body.like,
        user: req.body.user,
      };
      review.like.push(reviewReact);
      review.countReacts = review.like.length;

      console.log(review.countReact);
      await product.save();
      res.status(200).send({
        message: "Add new react successfully",
        data: product,
      });
    } catch (error) {
      if (product == null) {
        httpErrors.notFound(res, error, "product");
      } else if (review == null) {
        httpErrors.notFound(res, error, "review");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  detailsReact: async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    let product;
    try {
      product = await productModel.findById(id);
      console.log(reviewId);
      const review = await product.review.id(reviewId);
      const reactList = review.like;
      console.log(reactList);
      if (review == null) {
        res.status(404).send({ message: "This review cannot be found" });
      } else {
        res
          .status(200)
          .send({ message: "Get details react successfully", data: reactList });
      }
    } catch (error) {
      if (product == null) {
        httpErrors.notFound(res, error, "product");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  deleteReact: async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    let userId = req.params.userId;
    let product;
    let review;
    try {
      product = await productModel.findById(id);
      review = product.review.id(reviewId);
      react = review.like.find((item) => item.user == userId);

      console.log(react);
      console.log(review);

      await react.remove({ _id: react._id }, () => {
        console.log("remove successfully");
      });
      review.countReacts = review.like.length;
      await product.save();
      res.status(200).send({
        message: "Remove item successfully",
        data: product,
      });
    } catch (error) {
      if (product == null) {
        httpErrors.notFound(res, error, "product");
      } else if (review == null) {
        httpErrors.notFound(res, error, "review");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
};

module.exports = productReviewController;
