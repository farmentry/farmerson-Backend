const express = require("express");
const router = express.Router();
const { requiredToken } = require("../utils/authentication");
const {
  createCropDetails,
} = require("../controller/crop-managament.controller");

router.post("/create", requiredToken, createCropDetails);
module.exports = router;
