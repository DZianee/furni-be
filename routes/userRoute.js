const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddlewareController = require("../middleware/auth");
// const { userAvatar } = require("../middleware/mutler");

const auth = authMiddlewareController.verifyToken;

router.post("/newUser", auth, userController.newUser);

router.post("/login", userController.userLogin);

router.post("/register", userController.userRegister);

router.post("/checkInfo", userController.forgotPass);

router.post("/updateForgotPass", userController.updateForgotPass);

router.post("/refreshToken", userController.refreshToken);

router.get("/Customer/:roleId", auth, userController.getAllCustomers);

router.get("/Staff/:customerId", auth, userController.getAllStaff);

router.get("/", auth, userController.getAllUsers);

router.get("/userDetails/All/:id", auth, userController.getDetailsUser);

router.get("/userDetails/:id", auth, userController.getDetailsUserComment);

router.put("/updateUser/:id", userController.updateUser);

router.put("/addTempOrder/:id", userController.addTempOrder);

router.put("/updateTempOrder/:id", userController.updateTempOrder);

router.delete("/removeStaff/:id", auth, userController.deleteStaff);

module.exports = router;
