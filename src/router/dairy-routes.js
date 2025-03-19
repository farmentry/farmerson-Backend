const express = require("express");
const router = express.Router();
const { createDailyController } = require("../controller/dairy-controller");
const { requiredToken } = require("../utils/authentication");
router.post("/create", requiredToken, async (req, res) => {
  try {
    const response = await createDailyController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});

module.exports = router;
