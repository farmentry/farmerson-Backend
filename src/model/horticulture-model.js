const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const addOrUpdatePlantationModel = async (request, response) => {
  try {
    const {
      id,
      cropName,
      variety,
      plantingDate,
      expectedYield,
      growthStage,
      plantationArea,
      cultivationType,
      pesticidesUsed,
      fertilizersUsed,
    } = request.body;
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    if (id !== "0") {
      const { error } = await supabase
        .from("horticulture_crops")
        .update({
          crop_name: cropName,
          crop_variety: variety,
          planting_date: plantingDate,
          expected_yield: expectedYield,
          current_growth_stage: growthStage,
          total_plantation_area: plantationArea,
          type_of_cultivation: cultivationType,
          pesticides_used: pesticidesUsed,
          fertilizers_used: fertilizersUsed,
        })
        .eq("id", id)
        .eq("user_id", user_id);
      if (error) {
        console.error("Supabase Update Error:", error);
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to update details",
          error: error.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details updated successfully",
      });
    } else {
      const { error } = await supabase.from("horticulture_crops").insert([
        {
          user_id,
          crop_name: cropName,
          crop_variety: variety,
          planting_date: plantingDate,
          expected_yield: expectedYield,
          current_growth_stage: growthStage,
          total_plantation_area: plantationArea,
          type_of_cultivation: cultivationType,
          pesticides_used: pesticidesUsed,
          fertilizers_used: fertilizersUsed,
        },
      ]);
      if (error) {
        console.error("Supabase Insert Error:", error);
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to save details",
          error: error.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details saved successfully",
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return response.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};
const getByIdModel = async (request, response) => {
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
    const { data: Details, error: Error } = await supabase
      .from("horticulture_crops")
      .select("*")
      .eq("id", id);
    if (Error) {
      console.error("Supabase Query Error:", Error);
      return response.status(400).json({
        statusCode: 400,
        error: Error.message,
      });
    }
    const checkState = Details.filter((crop) => crop.state !== "2");
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: checkState,
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
const getAllDetailsModel = async (request, response) => {
  try {
    const user_id = request.params.id;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { data: horticultureDetails, error: horticultureError } =
      await supabase
        .from("horticulture_crops")
        .select("*")
        .eq("user_id", user_id);
    if (horticultureError) {
      console.error("Supabase Query Error:", horticultureError);
      return response.status(400).json({
        statusCode: 400,
        error: horticultureError.message,
      });
    }
    // const updateHorticultureDetails = horticultureDetails.filter(
    //   (crop) => crop.state !== "2"
    // );
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: horticultureDetails,
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

const addOrUpdatePlantationAgentModel = async (request, response) => {
  try {
    const {
      id,
      cropName,
      variety,
      plantingDate,
      expectedYield,
      growthStage,
      plantationArea,
      cultivationType,
      pesticidesUsed,
      fertilizersUsed,
    } = request.body;
    const user_id = request.params.id;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    if (id !== "0") {
      const { error } = await supabase
        .from("horticulture_crops")
        .update({
          crop_name: cropName,
          crop_variety: variety,
          planting_date: plantingDate,
          expected_yield: expectedYield,
          current_growth_stage: growthStage,
          total_plantation_area: plantationArea,
          type_of_cultivation: cultivationType,
          pesticides_used: pesticidesUsed,
          fertilizers_used: fertilizersUsed,
        })
        .eq("id", id)
        .eq("user_id", user_id);
      if (error) {
        console.error("Supabase Update Error:", error);
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to update details",
          error: error.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details updated successfully",
      });
    } else {
      const { error } = await supabase.from("horticulture_crops").insert([
        {
          user_id,
          crop_name: cropName,
          crop_variety: variety,
          planting_date: plantingDate,
          expected_yield: expectedYield,
          current_growth_stage: growthStage,
          total_plantation_area: plantationArea,
          type_of_cultivation: cultivationType,
          pesticides_used: pesticidesUsed,
          fertilizers_used: fertilizersUsed,
        },
      ]);
      if (error) {
        console.error("Supabase Insert Error:", error);
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to save details",
          error: error.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details saved successfully",
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return response.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};
const getAllDetailsAgentModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { data: horticultureDetails, error: horticultureError } =
      await supabase
        .from("horticulture_crops")
        .select("*")
        .eq("user_id", user_id);
    if (horticultureError) {
      console.error("Supabase Query Error:", horticultureError);
      return response.status(400).json({
        statusCode: 400,
        error: horticultureError.message,
      });
    }
    const updateHorticultureDetails = horticultureDetails.filter(
      (crop) => crop.state !== "2"
    );
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: updateHorticultureDetails,
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
const deleteByIdModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const id = request.params.id;
    const { data, error } = await supabase
      .from("horticulture_crops")
      .update({ state: "2" })
      .eq("id", id);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        error: error,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "deleted  successfully",
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
  addOrUpdatePlantationModel,
  getByIdModel,
  getAllDetailsModel,
  addOrUpdatePlantationAgentModel,
  getAllDetailsAgentModel,
  deleteByIdModel,
};
