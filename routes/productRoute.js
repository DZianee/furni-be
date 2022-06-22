const router = require("express").Router();
const productController = require("../controllers/productController");
const productReviewController = require("../controllers/product.review.controller")
const reviewReactController = require("../controllers/review.react.controller")
const { uploadImg} = require("../middleware/mutler");

router.get("/", productController.getAllProducts);

router.get("/productDetails/:id", productController.getProductDetails);

router.post("/newProduct", uploadImg, productController.newProduct);

router.put("/updateProduct/:id", uploadImg, productController.updateProduct);

router.delete("/:id", uploadImg, productController.deleteProduct);

//review

router.post("/productDetails/:id/Review", productReviewController.addReview)

router.put("/productDetails/:id/Review", productReviewController.updateReview)

router.delete("/productDetails/:id/Review", productReviewController.deleteReview)

//React

router.post("/productDetails/:id/React", reviewReactController.addReact)

router.delete("/productDetails/:id/React", reviewReactController.deleteReact)



module.exports = router;
