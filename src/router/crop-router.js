const express = require("express");
const router = express.Router();
const {
  createCropDetails,
} = require("../controller/crop-managament.controller");

router.post("/create", async (req, res) => {
  try {
    const response = await createCropDetails(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
module.exports = router;
