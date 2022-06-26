const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddlewareController = require("../middleware/auth");
const { userAvatar } = require("../middleware/mutler");


router.post("/newUser", userAvatar,userController.newUser);

router.post("/login", userController.userLogin);

router.post("/register", userAvatar,userController.userRegister);

router.post("/refreshToken", userController.refreshToken);

router.get("/Customer/:roleId", userController.getAllCustomers);

router.get("/Staff/:customerId", userController.getAllStaff);

router.get("/userDetails/Staff/:id", userController.getDetailsUser);

router.put("/updateUser/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
