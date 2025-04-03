const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const createOrUpdateDailyModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const { cattle } = request.body;

    if (!Array.isArray(cattle) || cattle.length === 0) {
      return response.status(400).json({
        statusCode: 400,
        error: "Invalid data. 'cattle' should be a non-empty array.",
      });
    }
    const insertData = cattle.map((item) => ({
      user_id,
      cattle_type: item.cattleType,
      breed_type: item.breed,
      total_cattle: item.totalCattle,
      milk_production_per_day: item.isProducingMilk ? item.milkProduction : 0,
      feeding_type: item.feedingType,
      is_pregnant: item.isPregnant,
    }));
    const { data, error } = await supabase
      .from("dairy_farming")
      .insert(insertData)
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return response.status(500).json({
        statusCode: 500,
        error: error.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Cattle details added successfully",
      data,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return response.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
    });
  }
};

const getAllDailyDetailsModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { data: Details, error: Error } = await supabase
      .from("dairy_farming")
      .select("*")
      .eq("user_id", user_id);
    if (Error) {
      console.error("Supabase Query Error:", Error);
      return response.status(400).json({
        statusCode: 400,
        error: Error.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: Details,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getDailyByIdModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const { id } = request.params;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { data: dairyDetails, error: dairyError } = await supabase
      .from("dairy_farming")
      .select("*")
      .eq("id", id);
    if (dairyError) {
      console.error("Supabase Query Error:", dairyError);
      return response.status(400).json({
        statusCode: 400,
        error: dairyError.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: dairyDetails,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  createOrUpdateDailyModel,
  getAllDailyDetailsModel,
  getDailyByIdModel,
};
