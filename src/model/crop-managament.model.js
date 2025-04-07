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
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { farm_size, cultivated_area } = getUserData.user;
    let newCultivatedArea = cultivated_area;
    if (cropId === "0") {
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
      newCultivatedArea += totalCultivatedArea;
    } else {
      const { data: existingCrop, error: fetchError } = await supabase
        .from("crop_management")
        .select("*")
        .eq("crop_id", cropId)
        .single();

      if (fetchError || !existingCrop) {
        return response.status(404).json({
          statusCode: 404,
          message: "Crop not found",
        });
      }

      const isDifferent =
        existingCrop.crop_name !== cropName ||
        existingCrop.crop_variety !== cropVariety ||
        existingCrop.sowing_date !== sowingDate ||
        existingCrop.expected_harvest_date !== expectedHarvestDate ||
        existingCrop.current_growth_stage !== currentGrowthStage ||
        existingCrop.total_cultivated_area !== totalCultivatedArea ||
        existingCrop.expected_yield !== expectedYield ||
        existingCrop.fertilizers_used !== fertilizersUsed ||
        existingCrop.pesticides_used !== pesticidesUsed ||
        existingCrop.market_price_per_quintal !== marketPricePerQuintal;

      if (!isDifferent) {
        return response.status(200).json({
          statusCode: 200,
          message: "No changes detected, crop details remain unchanged",
        });
      }

      const previousCultivatedArea = existingCrop.total_cultivated_area;
      newCultivatedArea =
        cultivated_area - previousCultivatedArea + totalCultivatedArea;
      if (newCultivatedArea > farm_size) {
        return response.status(400).json({
          statusCode: 400,
          message: "Total cultivated area exceeds farm size",
          exceededSize: newCultivatedArea - farm_size,
        });
      }
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
const createOrUpdateCropDetailsAgentModel = async (request, response) => {
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
    const user_id = request.params.id;
    console.log("user_id", user_id);
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { farm_size, cultivated_area } = getUserData.user;
    let newCultivatedArea = cultivated_area;
    if (cropId === "0") {
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
      newCultivatedArea += totalCultivatedArea;
    } else {
      const { data: existingCrop, error: fetchError } = await supabase
        .from("crop_management")
        .select("*")
        .eq("crop_id", cropId)
        .single();

      if (fetchError || !existingCrop) {
        return response.status(404).json({
          statusCode: 404,
          message: "Crop not found",
        });
      }

      const isDifferent =
        existingCrop.crop_name !== cropName ||
        existingCrop.crop_variety !== cropVariety ||
        existingCrop.sowing_date !== sowingDate ||
        existingCrop.expected_harvest_date !== expectedHarvestDate ||
        existingCrop.current_growth_stage !== currentGrowthStage ||
        existingCrop.total_cultivated_area !== totalCultivatedArea ||
        existingCrop.expected_yield !== expectedYield ||
        existingCrop.fertilizers_used !== fertilizersUsed ||
        existingCrop.pesticides_used !== pesticidesUsed ||
        existingCrop.market_price_per_quintal !== marketPricePerQuintal;
      if (!isDifferent) {
        return response.status(200).json({
          statusCode: 200,
          message: "No changes detected, crop details remain unchanged",
        });
      }
      const previousCultivatedArea = existingCrop.total_cultivated_area;
      newCultivatedArea =
        cultivated_area - previousCultivatedArea + totalCultivatedArea;
      if (newCultivatedArea > farm_size) {
        return response.status(400).json({
          statusCode: 400,
          message: "Total cultivated area exceeds farm size",
          exceededSize: newCultivatedArea - farm_size,
        });
      }
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
const getCropDetailsAgentModel = async (request, response) => {
  try {
    const user_id = request.params.id;
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
module.exports = {
  createOrUpdateCropDetailsModel,
  getCropDetailsModel,
  getCropByIdModel,
  createOrUpdateCropDetailsAgentModel,
  getCropDetailsAgentModel,
};
