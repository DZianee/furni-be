const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const httpErrors = require("../middleware/error");
const APIfeatures = require("../lib/features");

const orderController = {
  newOrder: async (req, res) => {
    const order = new orderModel({
      dateCreate: req.body.dateCreate,
      dateClose: req.body.dateClose,
      totalBill: req.body.totalBill,
      orderId: req.body.orderId,
      payment: {
        paymentMethod: req.body.paymentMethod,
        transactionID: req.body.transactionID,
      },
      user: req.body.user,
      cart: req.body.cart,
    });
    try {
      console.log(req.body.dateCreate);
      const currentDate = new Date(req.body.dateCreate);
      let day;
      if (currentDate.getDate() == 31) {
        day = 1;
      } else {
        day = currentDate.getDate() + 1;
      }
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();
      let hours = currentDate.getHours();
      let min = currentDate.getMinutes();
      order.dateClose =
        month + "/" + day + "/" + year + " " + hours + ":" + min;
      console.log(order.dateClose);
      const newOrder = await order.save();
      if (req.body.user) {
        const user = userModel.findById(req.body.user);
        await user.updateOne({ $push: { order: newOrder._id } });
      }
      res.status(200).send({ message: "New order created", data: newOrder });
    } catch (error) {
      if (error.name == "ValidationError") {
        httpErrors.badRequest(res, error);
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  getAll: async (req, res) => {
    let getAll;
    try {
      getAll = await orderModel.find();
      res
        .status(200)
        .send({ message: "Get all orders without features", data: getAll });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getAllOrders: async (req, res) => {
    let getAllOrders;

    try {
      const totalOrders = await orderModel.countDocuments();
      console.log(typeof req.query.search);
      console.log(totalOrders);
      const pageSize = 6;
      const pageTotals =
        Math.ceil((await orderModel.find()).length / pageSize) || 1;

      let pageTotalInFeatures;
      if (req.query.search != "") {
        const feature = new APIfeatures(orderModel.find(), req.query)
          .sorting()
          .searching()
          .filtering();

        getAllOrders = await feature.query.populate(
          "user",
          "firstname lastname"
        );
        pageTotalInFeatures = Math.ceil(getAllOrders.length / pageSize) || 1;

        const features = new APIfeatures(orderModel.find(), req.query)
          .pagination(pageSize)
          .sorting()
          .searching()
          .filtering();

        getAllOrders = await features.query.populate(
          "user",
          "firstname lastname"
        );
        res.status(200).send({
          message: "Get all successfully",
          data: getAllOrders,
          totalOrders: totalOrders,
          pageTotals: pageTotalInFeatures,
        });
      } else {
        const features = new APIfeatures(orderModel.find(), req.query)
          .pagination(pageSize)
          .sorting()
          .filtering();

        getAllOrders = await features.query.populate(
          "user",
          "firstname lastname"
        );
        res.status(200).send({
          message: "Get all successfully",
          data: getAllOrders,
          totalOrders: totalOrders,
          pageTotals: pageTotals,
        });
      }
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getNewOrders: async (req, res) => {
    let process = "New";
    try {
      const totalOrders = await orderModel.countDocuments({ process: process });
      // const pageTotals =
      //   Math.ceil(
      //     (await orderModel.find({ process: process })).length / pageSize
      //   ) || 1;

      const features = new APIfeatures(
        orderModel.find({ process: process }),
        req.query
      ).sorting();

      const getNewOrders = await features.query.populate(
        "user",
        " address phone email firstname lastname"
      );
      res.status(200).send({
        message: "Get all new orders successfully",
        data: getNewOrders,
        totalOrders: totalOrders,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getDeliveryOrders: async (req, res) => {
    let process = "Delivery";
    let getDeliveryOrders;
    try {
      const totalOrders = await orderModel.countDocuments({ process: process });
      if (req.query.search != "") {
        const features = new APIfeatures(
          orderModel.find({ process: process }),
          req.query
        )
          .sorting()
          .searching();

        getDeliveryOrders = await features.query.populate(
          "user",
          "firstname lastname address phone email"
        );
      } else {
        const features = new APIfeatures(
          orderModel.find({ process: process }),
          req.query
        ).sorting();

        getDeliveryOrders = await features.query.populate(
          "user",
          "firstname lastname address phone email"
        );
      }

      res.status(200).send({
        message: "Get all delivery orders successfully",
        data: getDeliveryOrders,
        totalOrders: totalOrders,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getCheckedOrders: async (req, res) => {
    let process = "Checked";
    try {
      const totalOrders = await orderModel.countDocuments({ process: process });
      const pageSize = req.query.pageSize;
      // const pageTotals =
      //   Math.ceil(
      //     (await orderModel.find({ process: process })).length / pageSize
      //   ) || 1;

      const features = new APIfeatures(
        orderModel.find({ process: process }),
        req.query
      )
        // .pagination(pageSize)
        .sorting();

      const getCheckedOrders = await features.query.populate(
        "user",
        "firstname lastname address phone email"
      );
      res.status(200).send({
        message: "Get all checked orders successfully",
        data: getCheckedOrders,
        totalOrders: totalOrders,
        // pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getCancelledOrders: async (req, res) => {
    let process = "Cancelled";
    try {
      const totalOrders = await orderModel.countDocuments({ process: process });
      const pageSize = req.query.pageSize;
      const pageTotals =
        Math.ceil(
          (await orderModel.find({ process: process })).length / pageSize
        ) || 1;

      const features = new APIfeatures(
        orderModel.find({ process: process }),
        req.query
      )
        .pagination(pageSize)
        .sorting()
        .searching()
        .filtering();

      const getCancelledOrders = await features.query.populate(
        "user",
        "firstname lastname address phone email"
      );
      res.status(200).send({
        message: "Get all cancelled orders successfully",
        data: getCancelledOrders,
        totalOrders: totalOrders,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  deleteOrder: async (req, res) => {
    let order;
    try {
      order = orderModel.findById(req.params.id);

      const user = userModel.find({ order: req.params.id });
      console.log(user);
      const result = await user.updateMany(user, {
        $pull: { order: req.params.id },
      });
      console.log(result);
      const removeOrder = await orderModel.findOneAndDelete({
        _id: req.params.id,
      });
      res
        .status(200)
        .send({ message: "delete successfully", data: removeOrder });
    } catch (error) {
      if (order == null) {
        httpErrors.notFound(res, error, "ID");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  getDetails: async (req, res) => {
    try {
      const getDetails = await orderModel.findById(req.params.id);
      res
        .status(200)
        .send({ message: "Get details successfully", data: getDetails });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  updateOrder: async (req, res) => {
    let order;
    let orderId = req.params.id;
    let updateOrder;
    console.log(orderId);
    try {
      order = await orderModel.findById(orderId);
      if (req.body.payStatus) {
        updateOrder = {
          payment: {
            payStatus: req.body.payStatus,
            transactionID: req.body.transactionID,
            paymentMethod: req.body.paymentMethod,
          },
        };
      } else {
        updateOrder = {
          status: req.body.status,
          process: req.body.process,
        };
      }

      const updated = await orderModel.updateOne(
        { _id: orderId },
        { $set: updateOrder }
      );
      res.status(200).send({ message: "Updated successfully", data: updated });
    } catch (error) {
      if (order == null) {
        httpErrors.notFound(res, error, "ID");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  getAllUserOrders: async (req, res) => {
    let userId = req.params.userId;
    let order;
    console.log(req.query.kindOf);
    try {
      order = await orderModel.find({ user: userId });

      const features = new APIfeatures(
        orderModel.find({ user: userId }),
        req.query
      ).sorting();

      const orderList = await features.query;
      res.status(200).send({
        message: "get all order of this customer successfully",
        data: orderList,
      });
    } catch (error) {
      if (user == null) {
        httpErrors.notFound(res, error, "order of this customer");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  getUserOrdersPerStatus: async (req, res) => {
    let userId = req.params.userId;
    let process = req.query.process;
    let order;
    try {
      order = await orderModel.find({ user: userId });
      const result = order.filter((item) => item.process == process);
      res.status(200).send({
        message: "get orders of this customer successfully",
        data: result,
      });
    } catch (error) {
      if (user == null) {
        httpErrors.notFound(res, error, "order of this customer");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  checkProductInOrder: async (req, res) => {
    let id = req.params.productId;
    let arr = [];
    let tempArr = [];
    try {
      const order = await orderModel.find();
      order.forEach((item) => {
        tempArr.push(item.cart);
      });
      arr = tempArr.flat();
      const result = arr.some((item) => item.product === id);
      res.status(200).send({ message: "check is done", data: result });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
};
const test = () => {
  // let x = new Date(Date.now());
  // let day = x.getDate();

  // console.log(x);
  // console.log(day);

  const input = [[{ firstName: "Joe" }], [{ firstName: "Kelly" }]];

  const output = input.flat();

  console.log(output);
};
// test();
module.exports = orderController;
