const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  const configFile = "./.env.dev";
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
};

module.exports = {
  development: dbConfig,
  production: dbConfig,
};
