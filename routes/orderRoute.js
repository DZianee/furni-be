const router = require("express").Router();
const orderController = require("../controllers/orderController");
const authMiddlewareController = require("../middleware/auth");

const auth = authMiddlewareController.verifyToken;

router.post("/newOrder", auth, orderController.newOrder);

router.get("/", auth, orderController.getAllOrders);

router.get("/newOrders", auth, orderController.getNewOrders);

router.get("/deliveryOrders", auth, orderController.getDeliveryOrders);

router.get("/checkedOrders", auth, orderController.getCheckedOrders);

router.get("/cancelledOrders", auth, orderController.getCancelledOrders);

router.delete("/:id", auth, orderController.deleteOrder);

router.get("/orderDetails/:id", auth, orderController.getDetails);

router.put("/updateOrder/:id", auth, orderController.updateOrder);

/* orders per user */
router.get("/allOrderPerUser/:userId", auth, orderController.getAllUserOrders);

router.get("/perOrderPerUser/:userId", auth, orderController.getUserOrdersPerStatus);

module.exports = router;
