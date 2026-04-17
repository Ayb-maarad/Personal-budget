const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");

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

const umzug = new Umzug({
    migrations: {
        glob: path.join(__dirname, "migrations/*.js"),
        resolve: ({ name, path: migPath, context }) => {
            const migration = require(migPath);
            return {
                name,
                up: async () => migration.up(context, Sequelize),
                down: async () => migration.down(context, Sequelize),
            };
        },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

async function connectDB() {
    await sequelize.authenticate();
    await umzug.up();  // runs all pending migrations
    console.log("Database connected and migrations applied");
}

module.exports = {
    sequelize,
    DataTypes,
    connectDB,
    User,
};
