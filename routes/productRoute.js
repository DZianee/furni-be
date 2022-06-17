const router = require("express").Router();
const productController = require("../controllers/productController")

router.get("/", productController.getAllProducts)

router.get("/:id", productController.getProductDetails)

router.post("/", productController.newProduct)

router.put("/:id", productController.updateProduct)

router.delete("/:id", productController.deleteProduct)


module.exports = router;