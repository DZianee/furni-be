const router = require("express").Router();
const orderController = require("../controllers/orderController");


router.post("/newOrder", orderController.newOrder);

router.get("/", orderController.getAllOrders);

router.delete("/:id", orderController.deleteOrder);

router.get("/orderDetails/:id", orderController.getDetails);


module.exports = router;
