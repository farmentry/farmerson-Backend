const express = require("express");
const router = express.Router();
const {
  addPlantationController,
} = require("../controller/horticulture-controller");
router.post("/create", addPlantationController);

module.exports = router;
