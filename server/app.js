require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database
const connectToMongoDB = require("./db/db");
connectToMongoDB();

// Import and use route files
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
app.use(authRoutes);
app.use(scoreRoutes);

app.listen(8000, () => {
  console.log("connected on port 8000");
});
