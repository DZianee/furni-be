const productModel = require("../models/productModel");
const httpErrors = require("../middleware/error");

const productReviewController = {
  addReact: async (req, res) => {
    let id = req.params.id;
    let reviewId = req.query.reviewId;
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
      review.countReact = review.like.length;

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
  deleteReact: async (req, res) => {
    let id = req.params.id;
    let reviewId = req.query.reviewId;
    let reactId = req.query.reactId;
    let product;
    let review;
    let react;
    try {
      product = await productModel.findById(id);
      review = product.review.id(reviewId);
      react = review.like.id(reactId);

      await react.remove({ _id: reactId }, () => {
        console.log("remove successfully");
      });
      review.countReact = review.like.length;

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
      } else if (react == null) {
        httpErrors.notFound(res, error, "react");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
};

module.exports = productReviewController;
