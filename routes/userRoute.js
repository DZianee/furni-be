const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddlewareController = require("../middleware/auth");
const { userAvatar } = require("../middleware/mutler");

const auth = authMiddlewareController.verifyToken;

router.post("/newUser", auth, userAvatar, userController.newUser);

router.post("/login", userController.userLogin);

router.post("/register", userAvatar, userController.userRegister);

router.post("/refreshToken", userController.refreshToken);

router.get("/Customer/:roleId", auth, userController.getAllCustomers);

router.get("/Staff/:customerId", auth, userController.getAllStaff);

router.get("/userDetails/Staff/:id", auth, userController.getDetailsUser);

router.put("/updateUser/:id", auth, userController.updateUser);

router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
