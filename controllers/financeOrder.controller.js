const financeModel = require("../models/financeModel");
const httpErrors = require("../middleware/error");

const finOrderSchemaController = {
  newfinOrder: async (req, res) => {
    let finance;
    console.log(req.body.month);
    let monthNow = new Date(req.body.month).getMonth();
    console.log(monthNow);
    let yearNow = new Date(req.body.month).getFullYear().toString();
    let monthByName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    try {
      finance = await financeModel.find({ year: yearNow });
      const arr = finance[0];
      const finOrder = {
        month: monthByName[monthNow],
        orderID: req.body.order,
        process: req.body.process,
        totalBill: req.body.totalBill,
        order_id: req.body.order_id,
        payment: req.body.paymentMethod,
      };
      arr.order.push(finOrder);
      arr.revenue = arr.revenue + finOrder.totalBill;
      arr.totalOrders = arr.order.length;
      await finance[0].save();

      res.status(200).send({
        message: "Add new fin order successfully",
        data: finance,
      });
    } catch (error) {
      if (finance == null) {
        httpErrors.notFound(res, error, "finance");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
};

const test = () => {
  let date = new Date();
  let nowDate = new Date(Date.now());

  let getMonth = date.getMonth();
  let getMonthNow = nowDate.getMonth();

  let setDate = "09-01-2022";
  let x = new Date(setDate).toLocaleDateString();

  console.log(date);
  console.log(new Date(date));
  console.log(nowDate);

  console.log(new Date(setDate).getMonth() + 1);
};

// test();
module.exports = finOrderSchemaController;
