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


    const sequelize = DATABASE_URL
        ? new Sequelize(DATABASE_URL, {
            dialect: "postgres",
            logging: false,
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

const User = require("./models/Users")(sequelize, DataTypes);


async function connectDB() {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Database connected");
}

module.exports = {
    sequelize,
    DataTypes,
    connectDB,
    User
};