const router = require("express").Router()
const roleController = require("../controllers/roleController")


router.post("/", roleController.addRole)

router.get("/", roleController.getAllRoles)

router.get("/:id", roleController.getDetailsRole)

router.put("/:id", roleController.updateRole)

router.delete("/:id", roleController.deleteRole)


module.exports = router