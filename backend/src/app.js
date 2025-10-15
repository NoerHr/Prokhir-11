const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");

const barangRoutes = require("./routes/barangRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/", barangRoutes);
app.use("/", kategoriRoutes);
app.use("/", authRoutes);
app.use("/", claimRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Lost & Found API is running",
        version: "1.0.0",
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint tidak ditemukan",
    });
});

app.use(errorHandler);

module.exports = app;
