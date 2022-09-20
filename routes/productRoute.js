const router = require("express").Router();
const productController = require("../controllers/productController");
const productReviewController = require("../controllers/product.review.controller");
const reviewReactController = require("../controllers/review.react.controller");
const authMiddlewareController = require("../middleware/auth");
const { uploadImg } = require("../middleware/mutler");

const auth = authMiddlewareController.verifyToken;

//product
router.get("/:categoryId", auth, productController.getAllProducts);

router.get("/", productController.getAll);

router.get("/productDetails/:id", productController.getProductDetails);

router.get("/reviewPerUser/:userId", productController.getReviewsPerUser);

router.get("/getProductCate/:cateId", productController.getProductByCateName);

router.post("/newProduct", auth, uploadImg, productController.newProduct);

router.get(
  "/:productId/Review/sortComment",
  productController.getSortCommentInReview
);

router.get(
  "/:productId/Review/topLike",
  productController.getTopHighestReactInReview
);

router.put(
  "/updateProduct/:id",
  auth,
  uploadImg,
  productController.updateProduct
);

router.put(
  "/updateProductPrice/:id",
  auth,
  productController.updateExportQuantity
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

router.post(
  "/productDetails/:id/Review/:reviewId/React",
  auth,
  reviewReactController.addReact
);

router.get(
  "/productDetails/:id/Review/:reviewId/React",
  auth,
  reviewReactController.addReact
);

router.delete(
  "/productDetails/:id/Review/:reviewId/React/:userId",
  auth,
  reviewReactController.deleteReact
);

module.exports = router;
