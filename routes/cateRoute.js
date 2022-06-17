const router = require("express").Router();
const categoryController = require("../controllers/categoryController")


router.post("/", categoryController.newCate)

router.get("/", categoryController.getAll)

router.get("/:id", categoryController.getDetails)

router.put("/:id", categoryController.updateCate)

router.delete("/:id", categoryController.deleteCate)



module.exports = router