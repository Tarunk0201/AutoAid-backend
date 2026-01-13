const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database"); // Initialize database connections

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Key verification middleware
const API_KEY = process.env.API_KEY;
app.use("/api", (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid API Key" });
  }
  next();
});

// Routes
const adminAuthRoutes = require("./server/admin/routes/authRoutes"); //admin

const requestRoutes = require("./server/routes/requestRoutes");

app.use("/api/admin", adminAuthRoutes); //admin

app.use("/api", requestRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Autoaid Backend API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connect to databases and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to connect to the database. Server not started.",
      err
    );
    process.exit(1);
  });

module.exports = app;
