const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const createOrUpdateCropDetailsModel = async (request, response) => {
  try {
    const {
      cropId,
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

    // Fetch user data
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    const { farm_size, cultivated_area } = getUserData.user;
    const newCultivatedArea = cultivated_area + totalCultivatedArea;

    // Check if the cultivated area exceeds the farm size
    if (newCultivatedArea > farm_size) {
      return response.status(400).json({
        statusCode: 400,
        message: "Total cultivated area exceeds farm size",
        exceededSize: newCultivatedArea - farm_size,
      });
    }

    if (cropId === "0") {
      // Insert new crop data
      const { error: insertError } = await supabase
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
        ]);

      if (insertError) {
        console.error("Supabase Insert Error:", insertError);
        return response.status(400).json({
          statusCode: 400,
          error: insertError.message,
        });
      }
    } else {
      // Update existing crop data
      const { error: updateError } = await supabase
        .from("crop_management")
        .update({
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
        })
        .eq("crop_id", cropId);

      if (updateError) {
        console.error("Supabase Update Error:", updateError);
        return response.status(400).json({
          statusCode: 400,
          error: updateError.message,
        });
      }
    }

    // Update cultivated area in the users table
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        cultivated_area: newCultivatedArea,
        exceeded_cultivated_area:
          newCultivatedArea > farm_size ? newCultivatedArea - farm_size : 0,
      })
      .eq("user_id", user_id);

    if (userUpdateError) {
      console.error("Error updating cultivated area:", userUpdateError);
      return response.status(400).json({
        statusCode: 400,
        error: "Failed to update cultivated area",
      });
    }

    // Send success response
    return response.status(200).json({
      statusCode: 200,
      message:
        cropId === "0"
          ? "Crop details created successfully"
          : "Crop details updated successfully",
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

const getCropDetailsModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    console.log(">>>>>>>>>", getUserData);

    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    const { data: cropDetails, error: cropError } = await supabase
      .from("crop_management")
      .select("*")
      .eq("user_id", user_id);

    if (cropError) {
      console.error("Supabase Query Error:", cropError);
      return response.status(400).json({
        statusCode: 400,
        error: cropError.message,
      });
    }

    return response.status(200).json({
      statusCode: 200,
      message: "Crop details retrieved successfully",
      data: cropDetails,
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

const getCropByIdModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const { crop_id } = request.params;
    const getUserData = await getUser(user_id);

    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    const { data: cropDetails, error: cropError } = await supabase
      .from("crop_management")
      .select("*")
      .eq("crop_id", crop_id);

    if (cropError) {
      console.error("Supabase Query Error:", cropError);
      return response.status(400).json({
        statusCode: 400,
        error: cropError.message,
      });
    }

    return response.status(200).json({
      statusCode: 200,
      message: "Crop details retrieved successfully",
      data: cropDetails,
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
  createOrUpdateCropDetailsModel,
  getCropDetailsModel,
  getCropByIdModel,
};
