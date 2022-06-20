const roleModel = require("../models/roleModel");
const httpError = require("../middleware/error");

// const userModel = require("../models/userModel");

const roleController = {
  addRole: async (req, res) => {
    try {
      const newRole = new roleModel({
        name: req.body.name,
        status: req.body.status,
      });
      const saveRole = await newRole.save();
      res
        .status(200)
        .send({ message: "create role successfully", data: saveRole });
    } catch (error) {
      httpError.badRequest(res, error);
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
  getDetailsRole: async (req, res) => {
    let id = req.params.id;
    let role;
    try {
      role = await roleModel.find({ _id: id });
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
  deleteRole: async (req, res) => {
    let id = req.params.id;
    let role;
    try {
      role = await roleModel.find({ _id: id });
      //   const user = userModel.find({ role: req.params.id });
      //   if (user) {
      //     res.status(400).send({
      //       message: "This role is being used, you are not allowed to remove it.",
      //     });
      //   } else {
      roleModel.deleteOne({ _id: id }, () => {
        console.log("delete successfully");
      });
      //   }
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
