const supabase = require("../configaration/db.config");

const createDailyModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const { cattleType, breed, milkProduction, feedingType, totalCattle } =
      request.body;
    if (!user_id || !cattleType || !breed || !milkProduction || !feedingType) {
      return {
        statusCode: 400,
        error: "Missing required fields",
      };
    }
    const { data: insertedData, error: insertError } = await supabase
      .from("dairy_farming")
      .insert([
        {
          user_id,
          cattle_type: cattleType,
          feeding_type: feedingType,
          total_cattle: totalCattle,
          breed_type: breed,
          milk_production_per_day: milkProduction,
        },
      ])
      .select();
    if (insertError) {
      console.error("Supabase Insert Error:", insertError.message);
      return {
        statusCode: 500,
        error: insertError.message,
      };
    }
    return {
      statusCode: 200,
      message: "Details are saved successfully",
    };
  } catch (error) {
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};

module.exports = { createDailyModel };
