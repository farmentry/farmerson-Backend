const express = require("express");
const router = express.Router();
const { requiredToken, agentOnly } = require("../utils/authentication");
const {
  createOrUpdatePoultryController,
  getAllDetailsController,
  getByIdController,
  createOrUpdatePoultryAgentController,
  getAllDetailsAgentController,
} = require("../controller/poultry-controller");

router.post("/create", requiredToken, createOrUpdatePoultryController);
router.get("/get-all", requiredToken, getAllDetailsController);
router.get("/get/:id", requiredToken, getByIdController);

//agents
router.post(
  "/create/:id",
  requiredToken,
  agentOnly,
  createOrUpdatePoultryAgentController
);
router.get(
  "/get-all/:id",
  requiredToken,
  agentOnly,
  getAllDetailsAgentController
);
router.get("/get/:id", requiredToken, agentOnly, getByIdController);
module.exports = router;
