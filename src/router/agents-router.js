const express = require("express");
const router = express.Router();
router.post("/add-farmer", requiredToken, agentOnly, registerUserController);
