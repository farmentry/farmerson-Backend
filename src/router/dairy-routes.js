const express = require("express");
const router = express.Router();
const {
  createOrUpdateDailyController,
  getAllDailyDetailsController,
  getDailyByIdController,
  createOrUpdateDailyAgentController,
  getAllDailyDetailsAgentController,
  deleteByIdAgentController,
} = require("../controller/dairy-controller");
const { requiredToken, agentOnly } = require("../utils/authentication");
router.post("/create", requiredToken, createOrUpdateDailyController);
router.get("/get-dairy-details", requiredToken, getAllDailyDetailsController);
router.get("/get-dairy/:id", requiredToken, getDailyByIdController);

router.post(
  "/create/:id",
  requiredToken,
  agentOnly,
  createOrUpdateDailyAgentController
);
router.get(
  "/get-dairy-details/:id",
  requiredToken,
  agentOnly,
  getAllDailyDetailsAgentController
);
router.get("/get-dairy/:id", requiredToken, agentOnly, getDailyByIdController);
router.delete(
  "/delete/:id",
  requiredToken,
  agentOnly,
  deleteByIdAgentController
);
module.exports = router;
