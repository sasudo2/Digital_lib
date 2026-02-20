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
const bookmarkRoutes = require("./routes/bookmark.routes");
const readingProgressRoutes = require("./routes/readingProgress.routes");

const { connectToDB } = require("./db/db");
connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Pathshala - Digital Library System!");
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
app.use("/bookmarks", bookmarkRoutes);
app.use("/reading-progress", readingProgressRoutes);
module.exports = app;
