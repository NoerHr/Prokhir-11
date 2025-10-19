const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");

const barangRoutes = require("./routes/barangRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint (root)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Lost & Found API is running",
    version: "1.0.0",
  });
});

app.use(`/items`, barangRoutes); // /api/v1/items
app.use(`/categories`, kategoriRoutes); // /api/v1/categories
app.use(`/auth`, authRoutes); // /api/v1/auth
app.use(`/claims`, claimRoutes); // /api/v1/claims

// 404 Handler - Must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    path: req.path,
  });
});

// Global Error Handler - Must be last
app.use(errorHandler);

module.exports = app;
