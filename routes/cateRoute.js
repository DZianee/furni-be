const router = require("express").Router();
const categoryController = require("../controllers/categoryController")


router.post("/newCate", categoryController.newCate)

router.get("/", categoryController.getAll)

router.get("/cateDetails/:id", categoryController.getDetails)

router.put("/updateCate/:id", categoryController.updateCate)

router.delete("/:id", categoryController.deleteCate)



module.exports = router