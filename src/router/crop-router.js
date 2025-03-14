const express = require("express");
const router = express.Router();
const {
  createCropDetails,
} = require("../controller/crop-managament.controller");

router.post("/create", createCropDetails);
module.exports = router;
