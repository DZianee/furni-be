const router = require("express").Router();
const productController = require("../controllers/productController")
const imgUpload = require("../middleware/mutler")




router.get("/", productController.getAllProducts)

router.get("/productDetails/:id", productController.getProductDetails)

router.post("/newProduct", imgUpload, productController.newProduct)

router.put("/updateProduct/:id", imgUpload,productController.updateProduct)

router.delete("/:id", imgUpload,productController.deleteProduct)


module.exports = router;