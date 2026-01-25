const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
//routes
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");

const { connectToDB } = require("./db/db");
connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Message from Uber team!");
});
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
module.exports = app;
