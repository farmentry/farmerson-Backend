const supabase = require("../configaration/db.config");
const { getUser } = require("../utils/authentication");
const createOrUpdatePoultryModel = async (request, response) => {
  try {
    const {
      id,
      poultry_type,
      capacity,
      current_stock,
      number_of_sheds,
      shed_type,
      feeding_system,
      water_system,
      waste_managed,
      batches = [],
      other_poultry_type,
    } = request.body;
    const { user_id } = request.user;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    if (id && id !== "0") {
      const { data: existingData, error: fetchError } = await supabase
        .from("poultry")
        .select("id, user_id")
        .eq("id", id)
        .single();
      if (fetchError) {
        return response
          .status(fetchError.code === "PGRST116" ? 404 : 400)
          .json({
            statusCode: fetchError.code === "PGRST116" ? 404 : 400,
            message:
              fetchError.code === "PGRST116"
                ? "Poultry record not found"
                : fetchError.message,
          });
      }
      const { error: updateError } = await supabase
        .from("poultry")
        .update({
          poultry_type,
          capacity,
          current_stock,
          number_of_sheds,
          shed_type,
          feeding_system,
          water_system,
          waste_managed,
          other_poultry_type,
        })
        .eq("id", id);
      if (updateError) {
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to update poultry record",
          error: updateError.message,
        });
      }
      try {
        await updateBatchesForPoultry(id, batches);
      } catch (batchError) {
        return response.status(400).json({
          statusCode: 400,
          message: "Poultry updated but batches failed to update",
          error: batchError.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details updated successfully",
      });
    }
    const { data: insertData, error: insertError } = await supabase
      .from("poultry")
      .insert([
        {
          user_id,
          poultry_type,
          capacity,
          current_stock,
          number_of_sheds,
          shed_type,
          feeding_system,
          water_system,
          waste_managed,
          other_poultry_type,
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      return response.status(400).json({
        statusCode: 400,
        message: "Failed to create poultry record",
        error: insertError.message,
      });
    }
    if (batches.length > 0) {
      try {
        await insertBatchesForPoultry(insertData.id, batches);
      } catch (batchError) {
        await supabase.from("poultry").delete().eq("id", insertData.id);
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to create batches",
          error: batchError.message,
        });
      }
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
const insertBatchesForPoultry = async (poultry_id, batches) => {
  try {
    const { error: fetchError } = await supabase
      .from("poultry")
      .select("id")
      .eq("id", poultry_id)
      .single();

    if (fetchError) {
      throw new Error("Invalid poultry record");
    }
    const formattedBatches = batches.map((batch) => ({
      poultry_id,
      number_of_birds: batch.number_of_birds,
      batch_start_date: batch.batch_start_date || null,
      is_producing_eggs: batch.is_producing_eggs || false,
      egg_production_per_day: batch.egg_production || 0,
    }));

    const { error: insertError } = await supabase
      .from("poultry_batches")
      .insert(formattedBatches);

    if (insertError) {
      throw new Error(`Batch insertion failed: ${insertError.message}`);
    }
  } catch (error) {
    console.error("Batch Error:", error);
    throw error;
  }
};
const updateBatchesForPoultry = async (poultry_id, batches) => {
  try {
    const { error: deleteError } = await supabase
      .from("poultry_batches")
      .delete()
      .eq("poultry_id", poultry_id);
    if (deleteError) {
      throw new Error(`Batch deletion failed: ${deleteError.message}`);
    }
    if (batches.length > 0) {
      await insertBatchesForPoultry(poultry_id, batches);
    }
  } catch (error) {
    console.error("Batch Update Error:", error);
    throw error;
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
      .select(
        `
    *,
    poultry_batches (
      *
    )
  `
      )
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
      .select(
        `
      *,
      poultry_batches (
        *
      )
    `
      )
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
      poultry_type,
      capacity,
      current_stock,
      number_of_sheds,
      shed_type,
      feeding_system,
      water_system,
      waste_managed,
      other_poultry_type,
      batches = [],
    } = request.body;
    const user_id = request.params.id;
    const getUserData = await getUser(user_id);
    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    if (id && id !== "0") {
      const { data: existingData, error: fetchError } = await supabase
        .from("poultry")
        .select("id, user_id")
        .eq("id", id)
        .single();
      if (fetchError) {
        return response
          .status(fetchError.code === "PGRST116" ? 404 : 400)
          .json({
            statusCode: fetchError.code === "PGRST116" ? 404 : 400,
            message:
              fetchError.code === "PGRST116"
                ? "Poultry record not found"
                : fetchError.message,
          });
      }
      const { error: updateError } = await supabase
        .from("poultry")
        .update({
          poultry_type,
          capacity,
          current_stock,
          number_of_sheds,
          shed_type,
          feeding_system,
          water_system,
          other_poultry_type,
          waste_managed,
        })
        .eq("id", id);
      if (updateError) {
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to update poultry record",
          error: updateError.message,
        });
      }
      try {
        await updateBatchesForPoultry(id, batches);
      } catch (batchError) {
        return response.status(400).json({
          statusCode: 400,
          message: "Poultry updated but batches failed to update",
          error: batchError.message,
        });
      }
      return response.status(200).json({
        statusCode: 200,
        message: "Details updated successfully",
      });
    }
    const { data: insertData, error: insertError } = await supabase
      .from("poultry")
      .insert([
        {
          user_id,
          poultry_type,
          capacity,
          current_stock,
          number_of_sheds,
          shed_type,
          feeding_system,
          water_system,
          waste_managed,
          other_poultry_type,
        },
      ])
      .select("id")
      .single();
    if (insertError) {
      return response.status(400).json({
        statusCode: 400,
        message: "Failed to create poultry record",
        error: insertError.message,
      });
    }
    if (batches.length > 0) {
      try {
        await insertBatchesForPoultry(insertData.id, batches);
      } catch (batchError) {
        await supabase.from("poultry").delete().eq("id", insertData.id);
        return response.status(400).json({
          statusCode: 400,
          message: "Failed to create batches",
          error: batchError.message,
        });
      }
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
    console.log("user_id", user_id);
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
      .select(
        `
  *,
  poultry_batches (
    *
  )
`
      )
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
const getDeleteByIdModel = async (request, response) => {
  try {
    const poultry_id = request.params.id;
    const { error: batchDeleteError } = await supabase
      .from("poultry_batches")
      .delete()
      .eq("poultry_id", poultry_id);
    if (batchDeleteError) {
      console.error("Batch Delete Error:", batchDeleteError);
      return response.status(400).json({
        statusCode: 400,
        message: "Failed to delete associated batches",
        error: batchDeleteError.message,
      });
    }
    const { error: poultryDeleteError } = await supabase
      .from("poultry")
      .delete()
      .eq("id", poultry_id);
    if (poultryDeleteError) {
      console.error("Poultry Delete Error:", poultryDeleteError);
      return response.status(400).json({
        statusCode: 400,
        message: "Failed to delete poultry record",
        error: poultryDeleteError.message,
      });
    }
    return response.status(200).json({
      statusCode: 200,
      message: "Poultry and associated batches deleted successfully",
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
  getDeleteByIdModel,
};
