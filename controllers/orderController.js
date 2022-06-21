const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const httpErrors = require("../middleware/error");

const orderController = {
  newOrder: async (req, res) => {
    const order = new orderModel({
      dateCreate: req.body.dateCreate,
      totalBill: req.body.totalBill,
      paymentMethod: req.body.paymentMethod,
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
    console.log(order);
    try {
      const newOrder = await order.save();
      if (req.body.user) {
        const user = userModel.findById(req.body.user);
        await user.updateOne({ $push: { order: newOrder._id } });
      }
      res.status(200).send({ data: newOrder});
    } catch (error) {
      httpErrors.badRequest(res, error);
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const getAllOrders = await orderModel
        .find()
        .populate("user", "name address phone email")
        // .populate("cart", "name code color");
      res
        .status(200)
        .send({ message: "Get all successfully", data: getAllOrders });
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
};

module.exports = orderController;
