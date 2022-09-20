const router = require("express").Router();
const finController = require("../controllers/financeController");
const finOrderSchemaController = require("../controllers/financeOrder.controller");
const authMiddlewareController = require("../middleware/auth");

const auth = authMiddlewareController.verifyToken;

router.post("/newRow", auth, finController.newRowLine);

router.get("/", finController.getAll);

router.get("/detailsFinInYear/:id", auth, finController.getDetails);

router.get(
  "/detailsFinInYear/chart/revenueEachMonth/:id",
  auth,
  finController.revenueEachMonthLineChart
);

router.get(
  "/detailsFinInYear/chart/orderEachMonth/:id",
  auth,
  finController.orderRevenueEachMonth
);

router.get(
  "/detailsFinInYear/chart/summaryPaymentMethod/:id",
  auth,
  finController.paymentMethodSummarizeChart
);

router.post(
  "/finOrder/newFinOrder",
  auth,
  finOrderSchemaController.newfinOrder
);

module.exports = router;
