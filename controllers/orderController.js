const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const httpErrors = require("../middleware/error");
const APIfeatures = require("../lib/features");

const orderController = {
  newOrder: async (req, res) => {
    const order = new orderModel({
      dateCreate: req.body.dateCreate,
      totalBill: req.body.totalBill,
      payment: {
        paymentMethod: req.body.paymentMethod,
      },
      status: req.body.status,
      process: req.body.process,
      user: req.body.user,
      cart: {
        quantity: req.body.quantity,
        amount: req.body.amount,
        color: req.body.color,
        productImg: req.body.productImg,
        name: req.body.name,
        product: req.body.product,
      },
    });
    try {
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
  getAllOrders: async (req, res) => {
    try {
      const totalOrders = await orderModel.countDocuments();
      const pageSize = req.query.pageSize;
      const pageTotals =
        Math.ceil((await orderModel.find()).length / pageSize) || 1;

      const features = new APIfeatures(orderModel.find(), req.query)
        .pagination(pageSize)
        .sorting()
        .searching()
        .filtering();

      const getAllOrders = await features.query.populate(
        "user",
        "name address phone email"
      );
      res.status(200).send({
        message: "Get all successfully",
        data: getAllOrders,
        totalOrders: totalOrders,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getNewOrders: async (req, res) => {
    let process = "New";
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

      const getNewOrders = await features.query.populate(
        "user",
        "name address phone email"
      );
      res.status(200).send({
        message: "Get all new orders successfully",
        data: getNewOrders,
        totalOrders: totalOrders,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getDeliveryOrders: async (req, res) => {
    let process = "Delivery";
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

      const getDeliveryOrders = await features.query.populate(
        "user",
        "name address phone email"
      );
      res.status(200).send({
        message: "Get all delivery orders successfully",
        data: getDeliveryOrders,
        totalOrders: totalOrders,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getCompletedOrders: async (req, res) => {
    let process = "Completed";
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

      const getCompletedOrders = await features.query.populate(
        "user",
        "name address phone email"
      );
      res.status(200).send({
        message: "Get all completed orders successfully",
        data: getCompletedOrders,
        totalOrders: totalOrders,
        pageTotals: pageTotals,
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
        "name address phone email"
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
      orderModel.deleteOne({ _id: req.params.id }, () => {
        console.log("delete");
      });
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
      const getDetails = await orderModel
        .find({ _id: req.params.id })
        .populate("user", "name address phone email");
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
    console.log(orderId);
    try {
      order = await orderModel.findById(orderId);
      console.log(order);

      const updateOrder = {
        status: req.body.status,
        process: req.body.process,
      };
      console.log(updateOrder);
      const updated = await orderModel.updateOne(
        { _id: orderId },
        { $set: updateOrder }
      );
      res.status(200).send({ message: "Updated successfully", data: updated });
      console.log(updated);
    } catch (error) {
      if (order == null) {
        httpErrors.notFound(res, error, "ID");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
};

module.exports = orderController;
