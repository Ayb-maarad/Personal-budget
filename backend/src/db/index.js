// src/db/index.js
const { Sequelize, DataTypes } = require("sequelize");



function buildSequelize() {
  const {
    DATABASE_URL,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    NODE_ENV,
  } = process.env;

  // Use DATABASE_URL if provided, otherwise use individual parts
  const sequelize = DATABASE_URL
    ? new Sequelize(DATABASE_URL, {
        dialect: "postgres",
        logging: false,
        // Useful for hosted DBs; harmless locally if not required
        dialectOptions:
          NODE_ENV === "production"
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
      })
    : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST || "localhost",
        port: DB_PORT ? Number(DB_PORT) : 5432,
        dialect: "postgres",
        logging: false,
      });

  return sequelize;
}

const sequelize = buildSequelize();


const Envelope = require("./models/Envelope")(sequelize, DataTypes);
 const Transaction = require("./models/Transaction")(sequelize, DataTypes);

// ---- Associations ----
 Envelope.hasMany(Transaction, { foreignKey: "envelopeId", onDelete: "CASCADE" });
 Transaction.belongsTo(Envelope, { foreignKey: "envelopeId" });

async function connectDB() {
  await sequelize.authenticate();
  // Don't use sync() for a migrations-based project.
  await sequelize.sync();
  console.log("✅ Database connected");
}

module.exports = {
  sequelize,
  DataTypes,
  connectDB,
  Envelope,
  Transaction,
};