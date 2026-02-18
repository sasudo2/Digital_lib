const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
//routes
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const bookRoutes = require("./routes/book.routes");
const reviewRoutes = require("./routes/review.routes");
const bookUsageRoutes = require("./routes/bookUsage.routes");
const readingTrackerRoutes = require("./routes/readingTracker.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const borrowingRoutes = require("./routes/borrowing.routes");
const genreRoutes = require("./routes/genre.routes");

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
app.use("/books", bookRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookusage", bookUsageRoutes);
app.use("/reading", readingTrackerRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/borrowing", borrowingRoutes);
app.use("/genres", genreRoutes);
module.exports = app;
