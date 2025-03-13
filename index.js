require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
// const { supabase } = require("./src/configaration/db.config");
app.use(cors());
app.use(express.json());
const userAuthenticationRouter = require("./src/router/user-authentication-router");
app.use("/auth", userAuthenticationRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
