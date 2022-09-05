const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
// const path = require("path");

const app = express();
dotenv.config();
const port = process.env.PORT || 2371;

// router
const categoryRoute = require("./routes/cateRoute");
const roleRoute = require("./routes/roleRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const financeRoute = require("./routes/financeRoute");

// usage
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(express.static("../uploads"));

// db
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.on("open", () => {
  console.log("successfully connected to mongodb");
});

//router link
app.use("/api/Category", categoryRoute);
app.use("/api/Fin", financeRoute);
app.use("/api/Role", roleRoute);
app.use("/api/Product", productRoute);
app.use("/api/User", userRoute);
app.use("/api/Order", orderRoute);
app.use(express.static(__dirname + "/resource/img/uploads"));
// app.get("/",)

// active
app.listen(port, () => {
  console.log("Server is running");
});
