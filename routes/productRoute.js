const router = require("express").Router();
const productController = require("../controllers/productController");
const { uploadImg} = require("../middleware/mutler");

router.get("/", productController.getAllProducts);

router.get("/productDetails/:id", productController.getProductDetails);

router.post("/newProduct", uploadImg, productController.newProduct);

router.put("/updateProduct/:id", uploadImg, productController.updateProduct);

router.delete("/:id", uploadImg, productController.deleteProduct);

module.exports = router;
