const Joi = require("joi");
const {
  createOrUpdatePoultryModel,
  getAllDetailsModel,
  getByIdModel,
  createOrUpdatePoultryAgentModel,
  getAllDetailsAgentModel,
  getDeleteByIdModel,
} = require("../model/poultry-model");
const poultrySchema = Joi.object({
  id: Joi.string().required(),
  poultry_type: Joi.string().valid("Broilers", "Layers", "Others").required(),
  other_poultry_type: Joi.string().when("poultry_type", {
    is: "Others",
    then: Joi.string().min(1).required(),
  }),
  capacity: Joi.number().integer().min(0).required(),
  current_stock: Joi.number().integer().min(0).required(),
  number_of_sheds: Joi.number().integer().min(0).required(),
  shed_type: Joi.string()
    .valid("Open", "Semi Closed", "Air Conditioned")
    .required(),
  feeding_system: Joi.string().valid("Manual", "Homegrown", "Mixed").required(),
  water_system: Joi.string().valid("Manual", "Nipples", "Automatic").required(),
  waste_managed: Joi.string()
    .valid("Sold to others", "Used As Fertilizer")
    .required(),
  batches: Joi.array()
    .items(
      Joi.object({
        number_of_birds: Joi.number().integer().min(0).required(),
        batch_start_date: Joi.string().allow("").required(),
        is_producing_eggs: Joi.boolean().required(),
        egg_production: Joi.number().min(0).precision(2).required(),
      })
    )
    .required(),
});
const createOrUpdatePoultryController = async (request, response) => {
  try {
    const { error } = poultrySchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }
    await createOrUpdatePoultryModel(request, response);
  } catch (error) {
    console.error("Controller Error:", error);
    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllDetailsController = async (request, response) => {
  try {
    const responseData = await getAllDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const getByIdController = async (request, response) => {
  try {
    const responseData = await getByIdModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const createOrUpdatePoultryAgentController = async (request, response) => {
  try {
    const { error } = poultrySchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }
    await createOrUpdatePoultryAgentModel(request, response);
  } catch (error) {
    console.error("Controller Error:", error);
    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllDetailsAgentController = async (request, response) => {
  try {
    const responseData = await getAllDetailsAgentModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const getDeleteByIdController = async (request, response) => {
  try {
    const responseData = await getDeleteByIdModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
module.exports = {
  createOrUpdatePoultryController,
  getAllDetailsController,
  getByIdController,
  createOrUpdatePoultryAgentController,
  getAllDetailsAgentController,
  getDeleteByIdController,
};
