require('dotenv').config();

const express = require("express");

const cors = require("cors");

const app = express();

const { connectDB } = require("./src/db");
const loginRoutes = require("./src/routes/Authroutes");
const registerRoutes = require("./src/routes/Authroutes");

const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(logger("dev"));
app.use(express.json());

// Mount routes
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();