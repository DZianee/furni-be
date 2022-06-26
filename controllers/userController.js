const userModel = require("../models/userModel");
const httpErrors = require("../middleware/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIfeatures = require("../lib/features");

const userController = {
  newUser: async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const user = new userModel({
      avatar: req.body.avatar,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashed,
      phone: req.body.phone,
      address: {
        street: req.body.street,
        ward: req.body.ward,
        district: req.body.district,
        city: req.body.city,
      },
      role: req.body.role,
      status: req.body.status,
      order: req.body.order,
    });
    try {
      const avatarName = req.file.filename;
      user.avatar = avatarName;
      const newUser = await user.save();
      res.status(200).send({ message: "New user is created", data: newUser });
    } catch (error) {
      if (error.name == "ValidationError") {
        httpErrors.badRequest(res, error);
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  userLogin: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        httpError.notFound(res, error, "user");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).send({ message: "Password is wrong" });
      }
      if (user && validPassword) {
        user.lastLogin = Date.now();
        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_CODE, {
          expiresIn: "10m",
        });
        const refreshToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_REFRESHCODE,
          {
            expiresIn: "2m",
          }
        );
        res.status(200).send({
          message: "Login verified",
          data: {
            email: user.email,
            lastLogin: user.lastLogin,
            token: token,
            refreshToken: refreshToken,
          },
        });
      }
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  userRegister: async (req, res) => {
    try {
      const find = await userModel.find({ email: req.body.email });
      if (!find) {
        res.send("user exist");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        const user = new userModel({
          avatar: req.body.avatar,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashed,
          phone: req.body.phone,
          address: {
            street: req.body.street,
            ward: req.body.ward,
            district: req.body.district,
            city: req.body.city,
          },
          role: req.body.role,
          status: req.body.status,
        });
        const avatarName = req.file.filename;
        user.avatar = avatarName;
        const newUser = await user.save();
        res.status(200).send({ message: "New user created", data: newUser });
      }
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  refreshToken: (req, res) => {
    let refreshToken = req.body.refreshToken;
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESHCODE,
      (err, user) => {
        if (err) {
          httpErrors.badRequest(res, error);
        } else {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_CODE, {
            expiresIn: "1m",
          });
          let refreshToken = req.body.refreshToken;
          res.status(200).send({
            message: "Refresh token successfully",
            token: token,
            refreshToken: refreshToken,
          });
        }
      }
    );
  },
  getAllStaff: async (req, res) => {
    let roleId = req.params.customerId;
    let getAll;
    try {
      const totalUsers = await userModel.countDocuments({
        role: { $ne: roleId },
      });

      const pageSize = 6;
      const pageTotals = Math.ceil(
        (await userModel.find({ role: { $ne: roleId } })).length / pageSize
      );

      const features = new APIfeatures(
        userModel.find({ role: { $ne: roleId } }),
        req.query
      )
        .pagination(pageSize)
        .sorting()
        .searching()
        .filtering();

      getAll = await features.query.populate("role", "name");

      res.status(200).send({
        message: "Get all staffs successfully",
        data: getAll,
        totalUsers: totalUsers,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  getAllCustomers: async (req, res) => {
    let roleId = req.params.roleId;
    let getAll;
    try {
      const pageSize = 6;
      const pageTotals =
        Math.ceil((await userModel.find({ role: roleId })).length / pageSize) ||
        1;

      const features = new APIfeatures(
        userModel.find({ role: roleId }),
        req.query
      )
        .pagination(pageSize)
        .sorting()
        .searching()
        .filtering();

      getAll = await features.query.populate("role", "name");

      res.status(200).send({
        message: "Get all customers successfully",
        data: getAll,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },

  getDetailsUser: async (req, res) => {
    let id = req.params.id;
    let getDetails;
    try {
      getDetails = await userModel.findById(id).populate("order");
      res.status(200).send({
        message: "Get user details successfully",
        data: {
          firstname: getDetails.firstname,
          lastname: getDetails.lastname,
          email: getDetails.email,
          phone: getDetails.phone,
          address: {
            street: getDetails.address.street,
            ward: getDetails.address.ward,
            district: getDetails.address.district,
            city: getDetails.address.city,
          },
          order: getDetails.order,
        },
      });
    } catch (error) {
      if (getDetails == null) {
        httpErrors.notFound(res, error, "user");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  updateUser: async (req, res) => {
    let id = req.params.id;
    let getUser;
    let user;
    try {
      getUser = await userModel.find({ _id: id });
      console.log(getUser);

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashed,
          phone: req.body.phone,
          address: {
            street: req.body.street,
            ward: req.body.ward,
            district: req.body.district,
            city: req.body.city,
          },
          role: req.body.role,
          status: req.body.status,
        };
      } else {
        user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          address: {
            street: req.body.street,
            ward: req.body.ward,
            district: req.body.district,
            city: req.body.city,
          },
          role: req.body.role,
          status: req.body.status,
        };
      }
      console.log(user);
      const updatedUser = await userModel.updateOne(
        { _id: id },
        { $set: user }
      );
      res
        .status(200)
        .send({ message: "Update user successfully", data: updatedUser });
    } catch (error) {
      if (getUser == null) {
        httpErrors.notFound(res, error, "user");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  deleteUser: async (req, res) => {},
};

module.exports = userController;
