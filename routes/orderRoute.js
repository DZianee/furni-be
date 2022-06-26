const router = require("express").Router();
const orderController = require("../controllers/orderController");
const authMiddlewareController = require("../middleware/auth");

const auth = authMiddlewareController.verifyToken;

router.post("/newOrder", auth, orderController.newOrder);

router.get("/", auth, orderController.getAllOrders);

router.get("/newOrders", auth, orderController.getNewOrders);

router.get("/deliveryOrders", auth, orderController.getDeliveryOrders);

router.get("/completedOrders", auth, orderController.getCompletedOrders);

router.get("/cancelledOrders", auth, orderController.getCancelledOrders);

router.delete("/:id", auth, orderController.deleteOrder);

router.get("/orderDetails/:id", auth, orderController.getDetails);

router.put("/updateOrder/:id", auth, orderController.updateOrder);

module.exports = router;
