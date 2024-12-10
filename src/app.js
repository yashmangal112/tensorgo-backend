// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Allow requests only from localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    credentials: true, // If you need to send cookies or authorization headers
  }));

app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/requests", requestRoutes);

module.exports = app;
