require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const ProductRouter = require("./Routes/ProductRoutes");
const OrderRouter = require("./Routes/OrderRoutes");
const PaymentRouter = require("./Routes/PaymentRoutes");
const UserRouter = require("./Routes/UserRoutes");
const errorMiddleware = require("./Middleware/Error");
const app = express();

const corsOptions = {
  origin: FRONTEND_URL,

  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); //use this for receiving payment

app.use("/product", ProductRouter);
app.use("/order", OrderRouter);
app.use("/payment", PaymentRouter);
app.use("/user", UserRouter);

app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("Connected to the database");
  })
  .then(() => {
    app.listen(PORT);
  })
  .then(() => {
    console.log(`Listening to port ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
