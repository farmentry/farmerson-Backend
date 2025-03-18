const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const { farmTypes } = require("../utils/constants");
const createCropDetailsModel = async (request, response) => {
  try {
    const {
      cropName,
      cropVariety,
      sowingDate,
      expectedHarvestDate,
      currentGrowthStage,
      totalCultivatedArea,
      expectedYield,
      fertilizersUsed,
      pesticidesUsed,
      marketPricePerQuintal,
    } = request.body;
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { farm_size, cultivated_area } = getUserData.user;
    const newCultivatedArea = cultivated_area + totalCultivatedArea;
    if (newCultivatedArea > farm_size) {
      const exceededsize = newCultivatedArea - farm_size;
      return response.status(400).json({
        statusCode: 400,
        message: "Total cultivated area exceeds farm size",
        exceedeSize: exceededsize,
      });
    }
    const { data, error: insertError } = await supabase
      .from("crop_management")
      .insert([
        {
          user_id,
          crop_name: cropName,
          crop_variety: cropVariety,
          sowing_date: sowingDate,
          expected_harvest_date: expectedHarvestDate,
          current_growth_stage: currentGrowthStage,
          total_cultivated_area: totalCultivatedArea,
          expected_yield: expectedYield,
          fertilizers_used: fertilizersUsed,
          pesticides_used: pesticidesUsed,
          market_price_per_quintal: marketPricePerQuintal,
        },
      ])
      .select();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return response.status(400).json({
        statusCode: 400,
        error: insertError.message,
      });
    }
    const { error: updateError } = await supabase
      .from("users")
      .update({
        cultivated_area: newCultivatedArea,
        exceeded_cultivated_area:
          newCultivatedArea > farm_size ? newCultivatedArea - farm_size : 0,
      })
      .eq("user_id", user_id);
    if (updateError) {
      console.error("Error updating cultivated area:", updateError);
      return response.status(400).json({
        statusCode: 400,
        error: "Failed to update cultivated area",
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Crop details created successfully",
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

module.exports = { createCropDetailsModel };
