const router = require("express").Router();
const roleController = require("../controllers/roleController");
const authMiddlewareController = require("../middleware/auth");

const auth = authMiddlewareController.verifyToken;

router.post("/newRole", auth, roleController.addRole);

router.get("/", auth, roleController.getAllRoles);

router.get("/roleDetails/:id", auth, roleController.getDetailsRole);

router.put("/updateRole/:id", auth, roleController.updateRole);

router.delete("/:id", auth, roleController.deleteRole);

module.exports = router;
