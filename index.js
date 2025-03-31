require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const setupSwagger = require("./src/configaration/swagger-config");
const userAuthenticationRouter = require("./src/router/user-authentication-router");
const cropManagentRouter = require("./src/router/crop-router");
const horticultureRoutes = require("./src/router/horticulture-router");
const dairyRoutes = require("./src/router/dairy-routes");
const poultry = require("./src/router/poultry-router");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Swagger Setup
setupSwagger(app);
// Routes
app.use("/public", express.static(path.join(__dirname, "src", "public")));
app.use("/auth", userAuthenticationRouter);
app.use("/crop", cropManagentRouter);
app.use("/horticulture", horticultureRoutes);
app.use("/dairy", dairyRoutes);
app.use("/poultry", poultry);
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).send("Something Wrong!");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
