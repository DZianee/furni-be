const router = require("express").Router()
const roleController = require("../controllers/roleController")


router.post("/newRole", roleController.addRole)

router.get("/", roleController.getAllRoles)

router.get("/roleDeatils/:id", roleController.getDetailsRole)

router.put("/updateRole/:id", roleController.updateRole)

router.delete("/:id", roleController.deleteRole)


module.exports = router