const express = require("express");
const router = express.Router();
const { requiredToken } = require("../utils/authentication");
const {
  createOrUpdateCropDetailsController,
  getAllCropDetailsController,
  getCropByIdController,
} = require("../controller/crop-managament.controller");

router.post("/create", requiredToken, createOrUpdateCropDetailsController);
router.get("/get-all-crops", requiredToken, getAllCropDetailsController);
router.get("/getcrop/:crop_id", requiredToken, getCropByIdController);
module.exports = router;
