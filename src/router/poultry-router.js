const express = require("express");
const router = express.Router();
const { requiredToken } = require("../utils/authentication");
const {
  createOrUpdatePoultryController,
  getAllDetailsController,
  getByIdController,
} = require("../controller/poultry-controller");

router.post("/create", requiredToken, createOrUpdatePoultryController);
router.get("/get-all", requiredToken, getAllDetailsController);
router.get("/get/:id", requiredToken, getByIdController);
module.exports = router;
