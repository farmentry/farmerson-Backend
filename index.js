require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const setupSwagger = require("./src/configaration/swagger-config");
const userAuthenticationRouter = require("./src/router/user-authentication-router");
const cropManagentRouter = require("./src/router/crop-router");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Swagger Setup
setupSwagger(app);

// Routes
app.use("/auth", userAuthenticationRouter);
app.use("/crop-management", cropManagentRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
