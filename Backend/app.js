const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();

//routes
const userRoutes = require("./routes/user.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectToDB = require("./db/db");
connectToDB();

app.get("/", (req, res) => {
  res.send("Message from Uber team!");
});
app.use("/users", userRoutes);

module.exports = app;
