const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const authMiddlewareController = require("../middleware/auth");

const auth = authMiddlewareController.verifyToken;

router.post("/newCate", auth, categoryController.newCate);

router.get("/", auth, categoryController.getAll);

router.get("/checkProduct/:id", auth, categoryController.checkProduct);

router.get("/cateDetails/:id", auth, categoryController.getDetails);

router.put("/updateCate/:id", auth, categoryController.updateCate);

router.delete("/:id", auth, categoryController.deleteCate);

module.exports = router;
