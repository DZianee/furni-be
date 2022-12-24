const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");
const httpErrors = require("../middleware/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIfeatures = require("../lib/features");

const userController = {
  refreshCode: "",
  newUser: async (req, res) => {
    try {
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
        tempOrder: req.body.tempOrder,
      });

      console.log(user);
      const newUser = await user.save();
      console.log(newUser.role);
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
      const user = await userModel
        .findOne({ email: req.body.email })
        .populate("role", "name");
      if (!user) {
        httpErrors.notFound(res, error, "user");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).send({ message: "Password is wrong" });
      }
      if (user.status != "Active") {
        httpErrors.notFound(res, error, "user");
      }
      if (user && validPassword) {
        user.lastLogin = Date.now();
        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_CODE, {
          expiresIn: "1d",
        });
        const refreshToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_REFRESHCODE,
          {
            expiresIn: "7d",
          }
        );
        this.refreshCode = refreshToken;
        res.status(200).send({
          message: "Login verified",
          data: {
            id: user._id,
            email: user.email,
            lastLogin: user.lastLogin,
            token: token,
            // refreshToken: refreshToken,
            avatar: user.avatar,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            tempOrder: user.tempOrder,
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
          email: req.body.email,
          avatar: req.body.avatar,
          password: hashed,
          role: req.body.role,
          status: req.body.status,
        });
        const role = await roleModel.find({ name: "Default User" });
        user.role = role[0]._id;
        // const avatarName = req.file.filename;
        // user.avatar = avatarName;
        const newUser = await user.save();
        res.status(200).send({ message: "New user created", data: newUser });
      }
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  refreshToken: (req, res) => {
    let refreshToken = this.refreshCode;
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESHCODE,
      (err, user) => {
        if (err) {
          httpErrors.badRequest(res, err);
        } else {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_CODE, {
            expiresIn: "1d",
          });
          res.status(200).send({
            message: "Refresh token successfully",
            token: token,
          });
        }
      }
    );
  },
  forgotPass: async (req, res) => {
    let findUser;
    try {
      console.log(req.body.email);
      console.log(req.body.phone);
      findUser = await userModel.find({
        email: req.body.email,
        phone: req.body.phone,
      });
      console.log(findUser);
      if (findUser != "") {
        res.status(200).send({ message: "user is exist" });
      } else {
        httpErrors.notFound(res, error, "user");
      }
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },
  updateForgotPass: async (req, res) => {
    let findUser;
    let newPass = req.body.newPass;
    try {
      findUser = await userModel.find({
        email: req.body.email,
      });
      console.log(findUser);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPass, salt);
      findUser[0].password = hashed;

      let user = {
        password: findUser[0].password,
      };

      const updatedPass = await userModel.updateOne(
        { _id: findUser[0]._id },
        { $set: user }
      );
      console.log(updatedPass);
      res
        .status(200)
        .send({ message: "forgot pass is updated", data: updatedPass });
    } catch (error) {
      if (findUser == null) {
        httpErrors.notFound(res, error, "user");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  getAllUsers: async (req, res) => {
    let roleId = req.params.customerId;
    let getAll;
    try {
      const totalUsers = await userModel.countDocuments();

      const pageSize = 6;
      const pageTotals = Math.ceil((await userModel.find()).length / pageSize);

      const features = new APIfeatures(userModel.find(), req.query)
        .pagination(pageSize)
        .sorting()
        .searching()
        .filtering();

      getAll = await features.query.populate("role", "name");

      res.status(200).send({
        message: "Get all users successfully",
        data: getAll,
        totalUsers: totalUsers,
        pageTotals: pageTotals,
      });
    } catch (error) {
      httpErrors.serverError(res, error);
    }
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
        // .pagination(pageSize)
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
      const totalCus = await userModel.find({ role: roleId }).countDocuments();
      const pageTotal =
        Math.ceil((await userModel.find({ role: roleId })).length / pageSize) ||
        1;

      let pageTotals;
      if (req.query.search != "") {
        const feature = new APIfeatures(
          userModel.find({ role: roleId }),
          req.query
        )
          .sorting()
          .searching()
          .filtering();

        getAll = await feature.query.populate("role", "name");
        pageTotals = Math.ceil(getAll.length / pageSize) || 1;

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
          totalCustomers: totalCus,
        });
      } else {
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
          pageTotals: pageTotal,
          totalCustomers: totalCus,
        });
      }
    } catch (error) {
      httpErrors.serverError(res, error);
    }
  },

  getDetailsUser: async (req, res) => {
    let id = req.params.id;
    let getDetails;
    try {
      getDetails = await userModel.findById(id);
      res.status(200).send({
        message: "Get user details successfully",
        data: {
          id: getDetails._id,
          lastLogin: getDetails.lastLogin,
          avatar: getDetails.avatar,
          firstname: getDetails.firstname,
          lastname: getDetails.lastname,
          email: getDetails.email,
          phone: getDetails.phone,
          status: getDetails.status,
          role: getDetails.role,
          address: {
            street: getDetails.address.street,
            ward: getDetails.address.ward,
            district: getDetails.address.district,
            city: getDetails.address.city,
          },
          order: getDetails.order,
          tempOrder: getDetails.tempOrder
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
  getDetailsUserComment: async (req, res) => {
    let id = req.params.id;
    let getDetails;
    try {
      getDetails = await userModel.findById(id);
      res.status(200).send({
        message: "Get user details successfully",
        data: {
          id: getDetails._id,
          firstname: getDetails.firstname,
          lastname: getDetails.lastname,
          avatar: getDetails.avatar,
        },
      });
      console.log(getDetails);
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
    let user = null;
    try {
      getUser = await userModel.findById(id);

      if (req.body.password) {
        const validPassword = await bcrypt.compare(
          req.body.oldPassword,
          getUser.password
        );
        if (validPassword) {
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
          res.status(404).send({ message: "Password is wrong" });
        }
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
      if (user != null) {
        const updatedUser = await userModel.updateOne(
          { _id: id },
          { $set: user }
        );
        res
          .status(200)
          .send({ message: "Update user successfully", data: updatedUser });
      }
    } catch (error) {
      if (getUser == null) {
        httpErrors.notFound(res, error, "user");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  //add temp order
  addTempOrder: async (req, res) => {
    let id = req.params.id;
    let getUser;
    let user = null;
    try {
      getUser = await userModel.findById(id);

      user = {
        tempOrder: req.body.tempOrder,
      };
      
      const updatedUser = await userModel.updateOne(
        { _id: id },
        { $set: user }
      );
      res
        .status(200)
        .send({ message: "Add temp order successfully", data: updatedUser });
    } catch (error) {
      if (getUser == null) {
        httpErrors.notFound(res, error, "user");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  //update temp order
  updateTempOrder: async (req, res) => {
    let id = req.params.id;
    let getUser;
    let user = null;

    try {
      getUser = await userModel.findById(id);

      user = {
        tempOrder: req.body.tempOrder,
      };
      
      const updatedUser = await userModel.updateOne(
        { _id: id },
        { $set: user }
      );
      res
        .status(200)
        .send({ message: "Update temp order successfully", data: updatedUser });
    } catch (error) {
      if (getUser == null) {
        httpErrors.notFound(res, error, "user");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
  deleteStaff: async (req, res) => {
    let id = req.params.id;
    let getUser;
    try {
      getUser = await userModel.findById(id);
      const deleteUser = await userModel.findOneAndDelete({ _id: id });
      res.status(200).send({ data: deleteUser });
    } catch (error) {
      if (getUser == null) {
        httpErrors.notFound(res, error, "staff");
      } else {
        httpErrors.serverError(res, error);
      }
    }
  },
};

module.exports = userController;
