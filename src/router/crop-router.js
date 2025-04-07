const express = require("express");
const router = express.Router();
const { requiredToken, agentOnly } = require("../utils/authentication");
const {
  createOrUpdateCropDetailsController,
  getAllCropDetailsController,
  getCropByIdController,
  createOrUpdateCropDetailsAgentController,
  getAllCropDetailsAgentController,
} = require("../controller/crop-managament.controller");

router.post("/create", requiredToken, createOrUpdateCropDetailsController);
router.get("/get-all-crops", requiredToken, getAllCropDetailsController);
router.get("/getcrop/:crop_id", requiredToken, getCropByIdController);

//agents routes
router.post(
  "/create/:id",
  requiredToken,
  agentOnly,
  createOrUpdateCropDetailsAgentController
);
router.get(
  "/get-all-crops/:id",
  requiredToken,
  agentOnly,
  getAllCropDetailsAgentController
);
router.get(
  "/getcrop/:crop_id",
  requiredToken,
  agentOnly,
  getCropByIdController
);
module.exports = router;
