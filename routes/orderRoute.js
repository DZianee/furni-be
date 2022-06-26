const router = require("express").Router();
const orderController = require("../controllers/orderController");


router.post("/newOrder", orderController.newOrder);

router.get("/", orderController.getAllOrders);

router.get("/newOrders", orderController.getNewOrders);

router.get("/deliveryOrders", orderController.getDeliveryOrders);

router.get("/completedOrders", orderController.getCompletedOrders);

router.get("/cancelledOrders", orderController.getCancelledOrders);

router.delete("/:id", orderController.deleteOrder);

router.get("/orderDetails/:id", orderController.getDetails);

router.put("/updateOrder/:id", orderController.updateOrder);


module.exports = router;
