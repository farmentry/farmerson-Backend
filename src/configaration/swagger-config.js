const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Farmerson API",
    version: "1.0.0",
    description: "API documentation for Farmerson",
  },
  servers: [
    {
      // url: `http://localhost:${process.env.PORT || 5000}`,
      url: `http://34.47.252.131`,
      description: "UAT server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/routes/*.js",
    "./src/swagger/*.js",
    "../swagger/horticulture-swagger/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
