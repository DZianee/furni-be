const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

const orderController = {
  newOrder: async (req, res) => {
    const order = new orderModel({
      dateCreate: req.body.dateCreate,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status,
      process: req.body.process,
      user: req.body.user,
    });
    try {
      const newOrder = await order.save();
      if (req.body.user) {
        const user = userModel.findById(req.body.user);
        await user.updateOne({ $push: { order: newOrder._id } });
        console.log(user);
      }
      res.status(200).send({ data: order });
      console.log(order);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const getAllOrders = await orderModel.find().populate("user","name");
      res
        .status(200)
        .send({ message: "get all successfully", data: getAllOrders });
    } catch (error) {
      res.status(400).send({ message: error });
    }
  },
  deleteOrder: async (req, res) => {
    let order;
    try {
      order = orderModel.find({ _id: req.params.id });

      const user = userModel.find({ order: req.params.id })
      console.log(user)
      const result = await user.updateMany(user, {$pull: {order: req.params.id}})
      console.log(result)
      orderModel.deleteOne({ _id: req.params.id }, () => {
        console.log("delete")
      });
    } catch (error) {
      if (order == null) {
        res.status(404).send({ message: "id not exist" });
      } else {
        res.status(500).send({ message: error.message });
      }
    }
  },
  getDetails: async (req, res) => {
    try {
      const getDetails = await orderModel.find({ _id: req.params.id }).populate("user", "name");
      res
        .status(200)
        .send({ message: "get details successfully", data: getDetails });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

const test = async (req, res) => {
  const query = await orderModel.findOne({
    customer: "62a0bf26cd16d9938e37ef0e",
  });
  console.log(query);
};

// test()
module.exports = orderController;
