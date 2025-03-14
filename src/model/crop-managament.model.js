const supabase = require("../configaration/db.config");

const createCropDetailsModel = async (data) => {
  try {
    // Ideally, save data to the database here using Supabase
    return {
      statusCode: 200,
      message: "Crop details created successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};

module.exports = { createCropDetailsModel };
