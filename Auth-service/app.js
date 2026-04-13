require('dotenv').config();

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const { connectDB } = require("./src/db");
const authRoutes = require("./src/routes/Authroutes");

const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use("/api/auth", authRoutes);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();