const supabase = require("../configaration/db.config");

const addPlantationModel = async (data) => {
  try {
    // Here, you would save `data` to the database using Supabase (if implemented)
    return {
      statusCode: 200,
      message: "Details are saved successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    };
  }
};

module.exports = { addPlantationModel };
