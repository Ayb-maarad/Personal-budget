require('dotenv').config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const { connectDB } = require("./src/db");
const envelopesRoutes = require("./src/routes/envelopesRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use("/api/envelopes", envelopesRoutes);
app.use("/api/transactions", transactionRoutes);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();