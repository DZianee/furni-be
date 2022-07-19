const roleModel = require("../models/roleModel");
const httpError = require("../middleware/error");

const userModel = require("../models/userModel");

const roleController = {
  addRole: async (req, res) => {
    const newRole = new roleModel({
      name: req.body.name,
      status: req.body.status,
    });
    try {
      const saveRole = await newRole.save();
      res
        .status(200)
        .send({ message: "create role successfully", data: saveRole });
    } catch (error) {
      if (error.name == "ValidationError") {
        httpError.badRequest(res, error);
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  getAllRoles: async (req, res) => {
    try {
      const getAll = await roleModel.find();
      res
        .status(200)
        .send({ message: "get all roles successfully", data: getAll });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getAllStaffRoles: async (req, res) => {
    let customerId = req.params.customerId;
    console.log(customerId);
    try {
      const getAll = await roleModel.find({ _id: { $ne: customerId } });
      res
        .status(200)
        .send({ message: "get all roles successfully", data: getAll });
    } catch (error) {
      httpError.serverError(res, error);
    }
  },
  getDetailsRole: async (req, res) => {
    let id = req.params.id;
    let role;
    try {
      role = await roleModel.findById(id);
      res
        .status(200)
        .send({ message: "get details role successfully", data: role });
    } catch (error) {
      if (role == null) {
        httpError.notFound(res, error, "role");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  updateRole: async (req, res) => {
    let id = req.params.id;
    let role;
    try {
      role = await roleModel.find({ _id: id });
      const model = {
        name: req.body.name,
        status: req.body.status,
      };
      const updateRole = await roleModel.updateOne(
        { _id: id },
        { $set: model }
      );
      res
        .status(200)
        .send({ message: "update successfully", data: updateRole });
    } catch (error) {
      if (role == null) {
        httpError.notFound(res, error, "role");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
  checkUserInRole: async (req, res) => {
    let id = req.params.id;
    let user;
    try {
      user = await userModel.find({ role: id });
      console.log(user);
      console.log(typeof user);
      if (user == "") {
        res.status(202).send({ message: "Available to delete" });
      } else {
        res.status(200).send({
          message: "This role is being used, you are not allowed to remove it.",
          data: user,
        });
      }
    } catch (err) {
      httpError.serverError(res, error);
    }
  },
  deleteRole: async (req, res) => {
    let id = req.params.id;
    let role;
    try {
      role = await roleModel.find({ _id: id });
      const deleteRole = await roleModel.findOneAndDelete({ _id: id });
      res.status(200).send({ data: deleteRole });
    } catch (error) {
      if (role == null) {
        httpError.notFound(res, error, "role");
      } else {
        httpError.serverError(res, error);
      }
    }
  },
};

module.exports = roleController;
