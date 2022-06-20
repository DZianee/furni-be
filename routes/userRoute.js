const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddlewareController = require("../middleware/auth");

router.post("/newUser", userController.newUser);

router.post("/login", userController.userLogin);

router.post("/register", userController.userRegister);

router.post("/refreshToken", userController.refreshToken);

router.get("/", userController.getAllUsers);

router.get("/userDetails/:id", userController.getDetailsUser);

router.put("/updateUser/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
