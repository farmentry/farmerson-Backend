const express = require("express");
const router = express.Router();
const {
  createOrUpdateDailyController,
  getAllDailyDetailsController,
  getDailyByIdController,
} = require("../controller/dairy-controller");
const { requiredToken } = require("../utils/authentication");
router.post("/create", requiredToken, createOrUpdateDailyController);
router.get("/get-dairy-details", requiredToken, getAllDailyDetailsController);
router.get("/get-dairy/:id", requiredToken, getDailyByIdController);
module.exports = router;
