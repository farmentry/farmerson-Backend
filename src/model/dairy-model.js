const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const createOrUpdateDailyModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const { feedingType, cattleType, milkProductionPerDay, id } = request.body;
    const insertData = {
      user_id,
      cattle_type: cattleType,
      milk_production_per_day: milkProductionPerDay,
      feeding_type: feedingType,
    };

    let data, error;

    if (id && id !== "0") {
      const { data: updatedData, error: updateError } = await supabase
        .from("dairy_farming")
        .update(insertData)
        .eq("id", id)
        .select();

      data = updatedData;
      error = updateError;

      if (error) {
        console.error("Supabase Error (Update):", error.message);
        return response.status(500).json({
          statusCode: 500,
          error: error.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details updated successfully",
      });
    } else {
      const { data: insertDataResult, error: insertError } = await supabase
        .from("dairy_farming")
        .insert([insertData])
        .select();

      data = insertDataResult;
      error = insertError;

      if (error) {
        console.error("Supabase Error (Insert):", error.message);
        return response.status(500).json({
          statusCode: 500,
          error: error.message,
        });
      }

      return response.status(200).json({
        statusCode: 200,
        message: "Details added successfully",
      });
    }
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
const createOrUpdateDailyAgentModel = async (request, response) => {
  try {
    const user_id = request.params.id;
    const { feedingType, cattleType, milkProductionPerDay, id } = request.body;
    const insertData = {
      user_id,
      cattle_type: cattleType,
      milk_production_per_day: milkProductionPerDay,
      feeding_type: feedingType,
    };

    let data, error;

    if (id && id !== "0") {
      const { data: updatedData, error: updateError } = await supabase
        .from("dairy_farming")
        .update(insertData)
        .eq("id", id)
        .select();

      data = updatedData;
      error = updateError;

      if (error) {
        console.error("Supabase Error (Update):", error.message);
        return response.status(500).json({
          statusCode: 500,
          error: error.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details updated successfully",
      });
    } else {
      const { data: insertDataResult, error: insertError } = await supabase
        .from("dairy_farming")
        .insert([insertData])
        .select();

      data = insertDataResult;
      error = insertError;

      if (error) {
        console.error("Supabase Error (Insert):", error.message);
        return response.status(500).json({
          statusCode: 500,
          error: error.message,
        });
      }

      return response.status(200).json({
        statusCode: 200,
        message: "Details added successfully",
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return response.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
    });
  }
};
const getAllDailyDetailsAgentModel = async (request, response) => {
  try {
    const user_id = request.params.id;
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
const deleteByIdAgentModel = async (request, response) => {
  try {
    const { user_id } = request.user;
    const id = request.params.id;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { data: deletedData, error: deleteError } = await supabase
      .from("dairy_farming")
      .delete()
      .eq("id", id)
      .select();

    if (deleteError) {
      console.error("Supabase Deletion Error:", deleteError);
      return response.status(400).json({
        statusCode: 400,
        error: deleteError.message,
      });
    }

    if (deletedData.length === 0) {
      return response.status(404).json({
        statusCode: 404,
        message: "Record not found",
      });
    }

    return response.status(200).json({
      statusCode: 200,
      message: "Record deleted successfully",
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
  createOrUpdateDailyAgentModel,
  getAllDailyDetailsAgentModel,
  deleteByIdAgentModel,
};
