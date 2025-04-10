const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const { farmTypes } = require("../utils/constants");
const createOrUpdatePoultryModel = async (request, response) => {
  try {
    const {
      id,
      current_stock,
      feed_type,
      poultry_type,
      farm_capacity,
      daily_egg_production,
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
      const { data: existingData, error: fetchError } = await supabase
        .from("poultry")
        .select("id")
        .eq("id", id)
        .single();
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Supabase Fetch Error:", fetchError);
        return response.status(400).json({
          statusCode: 400,
          error: fetchError.message,
        });
      }

      if (existingData) {
        const { error: updateError } = await supabase
          .from("poultry")
          .update({
            current_stock,
            feed_type,
            poultry_type,
            farm_capacity,
            daily_egg_production,
          })
          .eq("id", id);

        if (updateError) {
          console.error("Supabase Update Error:", updateError);
          return response.status(400).json({
            statusCode: 400,
            error: updateError.message,
          });
        }

        return response.status(200).json({
          statusCode: 200,
          message: "Details updated successfully",
        });
      }
    }
    const { error: insertError } = await supabase.from("poultry").insert([
      {
        user_id,
        current_stock,
        feed_type,
        poultry_type,
        farm_capacity,
        daily_egg_production,
      },
    ]);
    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return response.status(400).json({
        statusCode: 400,
        error: insertError.message,
      });
    }
    return response.status(201).json({
      statusCode: 201,
      message: "Details created successfully",
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
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { data: poultryDetails, error: poultryError } = await supabase
      .from("poultry")
      .select("*")
      .eq("user_id", user_id);
    if (poultryError) {
      console.error("Supabase Query Error:", poultryError);
      return response.status(400).json({
        statusCode: 400,
        error: poultryError.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: poultryDetails,
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
    const { data: cropDetails, error: cropError } = await supabase
      .from("poultry")
      .select("*")
      .eq("id", id);
    if (cropError) {
      console.error("Supabase Query Error:", cropError);
      return response.status(400).json({
        statusCode: 400,
        error: cropError.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
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
const createOrUpdatePoultryAgentModel = async (request, response) => {
  try {
    const {
      id,
      current_stock,
      feed_type,
      poultry_type,
      farm_capacity,
      daily_egg_production,
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
      const { data: existingData, error: fetchError } = await supabase
        .from("poultry")
        .select("id")
        .eq("id", id)
        .single();
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Supabase Fetch Error:", fetchError);
        return response.status(400).json({
          statusCode: 400,
          error: fetchError.message,
        });
      }
      if (existingData) {
        const { error: updateError } = await supabase
          .from("poultry")
          .update({
            current_stock,
            feed_type,
            poultry_type,
            farm_capacity,
            daily_egg_production,
          })
          .eq("id", id);
        if (updateError) {
          console.error("Supabase Update Error:", updateError);
          return response.status(400).json({
            statusCode: 400,
            error: updateError.message,
          });
        }

        return response.status(200).json({
          statusCode: 200,
          message: "Details updated successfully",
        });
      }
    }
    const { error: insertError } = await supabase.from("poultry").insert([
      {
        user_id,
        current_stock,
        feed_type,
        poultry_type,
        farm_capacity,
        daily_egg_production,
      },
    ]);
    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return response.status(400).json({
        statusCode: 400,
        error: insertError.message,
      });
    }
    return response.status(201).json({
      statusCode: 201,
      message: "Details created successfully",
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
const getAllDetailsAgentModel = async (request, response) => {
  try {
    const user_id = request.params.id;
    const getUserData = await getUser(user_id);
    console.log("user_id", user_id);
    console.log("user", getUserData);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    const { data: poultryDetails, error: poultryError } = await supabase
      .from("poultry")
      .select("*")
      .eq("user_id", user_id);
    if (poultryError) {
      console.error("Supabase Query Error:", poultryError);
      return response.status(400).json({
        statusCode: 400,
        error: poultryError.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Details retrieved successfully",
      data: poultryDetails,
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
  createOrUpdatePoultryModel,
  getAllDetailsModel,
  getByIdModel,
  createOrUpdatePoultryAgentModel,
  getAllDetailsAgentModel,
};
