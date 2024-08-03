const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { SERVER_URL, PORT } = require("./config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog App REST API with Swagger",
      version: "1.0.0",
      description:
        "This is a simple CRUD API for blog application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: `${SERVER_URL}:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
