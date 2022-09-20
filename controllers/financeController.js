const financeModel = require("../models/financeModel");
const httpError = require("../middleware/error");
const APIfeatures = require("../lib/features");
const { all } = require("../routes/financeRoute");

const financeController = {
  newRowLine: async (req, res) => {
    try {
      const rowLine = new financeModel({
        year: req.body.year,
      });
      const newRowLine = await rowLine.save();

      res.status(200).send({
        message: "New row line is created",
        data: newRowLine,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getAll: async (req, res) => {
    try {
      const allRows = await financeModel.find();

      res.status(200).send({
        message: "All row year lines is retrieved",
        data: allRows,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getDetails: async (req, res) => {
    let id = req.params.id;
    let queryMonth = req.query.month || "";
    let queryPaymentMethod = req.query.paymentMethod || "";
    let allRows;
    try {
      if (queryMonth == "" && queryPaymentMethod == "") {
        allRows = await financeModel.findById(id);
        res.status(200).send({
          message: "Details fin in a year content is retrieved",
          data: allRows,
        });
      } else {
        const orderList = (await financeModel.findById(id)).order;
        if (queryMonth != "" && queryPaymentMethod != "") {
          allRows = orderList.filter(
            (item) =>
              item.month === queryMonth && item.payment === queryPaymentMethod
          );
        } else if (queryMonth != "") {
          allRows = orderList.filter((item) => item.month === queryMonth);
        } else {
          allRows = orderList.filter(
            (item) => item.payment === queryPaymentMethod
          );
        }
        console.log(allRows);
        res.status(200).send({
          message: "Details fin in a year content is retrieved",
          data: { order: allRows },
        });
      }
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  revenueEachMonthLineChart: async (req, res) => {
    let id = req.params.id;
    let allRowOrders;
    let monthArr = [];
    let arr = [];
    let sumArr = [];
    try {
      allRowOrders = (await financeModel.findById(id)).order;

      console.log(allRowOrders);
      allRowOrders.forEach((item) => {
        arr.push(item.month);
      });
      monthArr = [...new Set(arr)];

      for (let value in monthArr) {
        let arrFilter;
        let sum = 0;

        arrFilter = allRowOrders.filter(
          (item) => item.month == monthArr[value]
        );
        arrFilter.forEach((item) => {
          sum = sum + item.totalBill;
        });
        sumArr.push(sum);
      }
      console.log(sumArr);
      res.status(200).send({
        message: "Revenue of each month is retrieved",
        month: monthArr,
        revenues: sumArr,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  paymentMethodSummarizeChart: async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let allRowOrders;
    try {
      allRowOrders = (await financeModel.findById(id)).order;

      const result = allRowOrders.reduce((copyArr, currValue) => {
        return {
          ...copyArr,
          [currValue.payment]: (copyArr[currValue.payment] || 0) + 1,
        };
      }, {});
      console.log(result);
      res.status(200).send({
        message: "Payment method data for chart is retrieved",
        data: result,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  orderRevenueEachMonth: async (req, res) => {
    let year = req.params.id;
    let allDataInYear;
    let monthArr = [];
    let arr = [];
    let sumArr = [];
    try {
      allDataInYear = await financeModel.find({ year: year });
      const orderList = allDataInYear[0].order;
      const ordersInYear = orderList.reduce((copyArr, currValue) => {
        return {
          ...copyArr,
          [currValue.month]: (copyArr[currValue.month] || 0) + 1,
        };
      }, []);

      orderList.forEach((item) => {
        arr.push(item.month);
      });
      monthArr = [...new Set(arr)];

      for (let value in monthArr) {
        let arrFilter;
        let sum = 0;

        arrFilter = orderList.filter((item) => item.month == monthArr[value]);
        arrFilter.forEach((item) => {
          sum = sum + item.totalBill;
        });
        sumArr.push(sum);
      }

      console.log(ordersInYear);
      res.status(200).send({
        message: "Orders in a year are retrieved",
        order: ordersInYear,
        month: monthArr,
        revenue: sumArr,
      });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
};

const test = () => {
  //   let x = [
  //     {
  //       name: "Ted",
  //       age: 23,
  //     },
  //     {
  //       name: "Anna",
  //       age: 23,
  //     },
  //     {
  //       name: "Anna",
  //       age: 25,
  //     },
  //     {
  //       name: "Jim",
  //       age: 25,
  //     },
  //   ];
  //   let nameArr = [];
  //   let arr = [];
  //   x.forEach((item) => {
  //     arr.push(item.name);
  //   });
  //   nameArr = [...new Set(arr)];
  //   let sumArr = [];
  //   for (let value in nameArr) {
  //     let y;
  //     let sum = 0;
  //     y = x.filter((item) => item.name == nameArr[value]);
  //     y.forEach((item) => {
  //       sum = sum + item.age;
  //     });
  //     sumArr.push(sum);
  //   }
  //   console.log(sumArr);

  //   let arr = ["Banana", "Orange", "Yeloow"];
  //   console.log(arr["Banana"]);

  let obj = { Anna: 20, Jake: 30 };
  console.log(obj.Anna);
};
test();

module.exports = financeController;
