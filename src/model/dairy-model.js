const supabase = require("../configaration/db.config");

const createDailyModel = async (data) => {
  try {
    console.log("Model", data);
    return {
      statusCode: 200,
      message: "Details are saved successfully",
    };
  } catch (error) {
    console.log(">>>>>>>>>>>>>>>>", error);
    throw new Error(error.message);
  }
};

module.exports = { createDailyModel };
