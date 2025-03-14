const supabase = require("../configaration/db.config");

const createCropDetailsModel = async (req, res) => {
  try {
    const {
      userId,
      cropName,
      variety,
      plantingDate,
      expectedYield,
      growthStage,
      plantationArea,
      cultivationType,
      pesticidesUsed,
      fertilizersUsed,
    } = req.body;
    // Return success response
    return res.status(200).json({
      statusCode: 200,
      message: "Crop details created successfully",
      data,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { createCropDetailsModel };
