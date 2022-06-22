const productModel = require("../models/productModel");
const httpErrors = require("../middleware/error");

const productReviewController = {
  addReview: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);

      const reviewComment = {
        comment: req.body.comment,
        user: req.body.user,
        rating: req.body.rating,
      };
      product.review.push(reviewComment);
      product.countReviews = product.review.length;

      await product.save();
      res.status(200).send({
        message: "Add new review successfully",
        data: product,
      });
    } catch (error) {
      if (product == null) {
        httpErrors.notFound(res, error, "product");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  updateReview: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);

      const review = await product.review.id(req.query.reviewId);
      if (review == null) {
        res.status(404).send({ message: "This review cannot be found" });
      } else {
        const reviewComment = {
          comment: req.body.comment,
          user: req.body.user,
          rating: req.body.rating,
        };
        review.set(reviewComment);
        const updateReview = await product.save();
        res
          .status(200)
          .send({ message: "Update review successfully", data: updateReview });
      }
    } catch (error) {
      if (product == null) {
        httpErrors.notFound(res, error, "product");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  deleteReview: async (req, res) => {
    let id = req.params.id;
    let product;
    try {
      product = await productModel.findById(id);

      const review = await product.review.id(req.query.reviewId);
      if (review == null) {
        res.status(404).send({ message: "This review cannot be found" });
      } else {
        const removeReview = await review.remove(
          { _id: req.query.reviewId },
          () => {
            console.log("delete successfully");
          }
        );
        product.countReviews = product.review.length;

        await product.save();
        res
          .status(200)
          .send({ message: "Remove review successfully", data: removeReview });
      }
    } catch (error) {
      if (product == null) {
        httpErrors.notFound(res, error, "product");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
};

module.exports = productReviewController;
