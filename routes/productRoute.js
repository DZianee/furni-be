const router = require("express").Router();
const productController = require("../controllers/productController");
const productReviewController = require("../controllers/product.review.controller");
const reviewReactController = require("../controllers/review.react.controller");
const authMiddlewareController = require("../middleware/auth");
const { uploadImg } = require("../middleware/mutler");

const auth = authMiddlewareController.verifyToken;

//product
router.get("/:categoryId", auth, productController.getAllProducts);

router.get("/", auth, productController.getAll);

router.get("/productDetails/:id", auth, productController.getProductDetails);

router.post("/newProduct", auth, uploadImg, productController.newProduct);

router.put(
  "/updateProduct/:id",
  auth,
  uploadImg,
  productController.updateProduct
);

router.delete("/:id", auth, uploadImg, productController.deleteProduct);

//review

router.post(
  "/productDetails/:id/Review",
  auth,
  productReviewController.addReview
);

router.get(
  "/productDetails/:id/Review/:reviewId",
  auth,
  productReviewController.detailsReview
);

router.put(
  "/productDetails/:id/Review/:reviewId",
  auth,
  productReviewController.updateReview
);

router.delete(
  "/productDetails/:id/Review/:reviewId",
  productReviewController.deleteReview
);

//React

router.post("/productDetails/:id/React", auth, reviewReactController.addReact);

router.delete(
  "/productDetails/:id/React",
  auth,
  reviewReactController.deleteReact
);

module.exports = router;
