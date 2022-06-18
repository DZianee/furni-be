const router = require("express").Router();
const productController = require("../controllers/productController")
const imgUpload = require("../middleware/mutler")




router.get("/", productController.getAllProducts)

router.get("/:id", productController.getProductDetails)

router.post("/", imgUpload, productController.newProduct)

router.put("/:id", imgUpload,productController.updateProduct)

router.delete("/:id", productController.deleteProduct)


module.exports = router;