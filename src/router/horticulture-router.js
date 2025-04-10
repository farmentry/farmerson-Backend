const express = require("express");
const router = express.Router();
const { requiredToken, agentOnly } = require("../utils/authentication");
const {
  addOrUpdatePlantationController,
  getAllDetailsController,
  getByIdController,
  addOrUpdatePlantationAgentController,
  deleteByIdController,
  getAllDetailsAgentController,
} = require("../controller/horticulture-controller");
router.post("/create", requiredToken, addOrUpdatePlantationController);
router.get("/get-all", requiredToken, getAllDetailsController);
router.get("/get/:id", requiredToken, getByIdController);

///agent routes
router.post(
  "/create/:id",
  requiredToken,
  agentOnly,
  addOrUpdatePlantationAgentController
);
router.get(
  "/get-all/:id",
  requiredToken,
  agentOnly,
  getAllDetailsAgentController
);
router.get("/get/:id", requiredToken, agentOnly, getByIdController);
router.delete("/delete/:id", requiredToken, agentOnly, deleteByIdController);

module.exports = router;
