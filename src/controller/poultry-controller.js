const Joi = require("joi");
const {
  createOrUpdatePoultryModel,
  getAllDetailsModel,
  getByIdModel,
  createOrUpdatePoultryAgentModel,
  getAllDetailsAgentModel,
} = require("../model/poultry-model");
const createOrUpdatePoultryController = async (request, response) => {
  try {
    const poultrySchema = Joi.object({
      id: Joi.string().required(),
      farm_capacity: Joi.number().integer().min(0).required(),
      current_stock: Joi.number().integer().min(0).required(),
      poultry_type: Joi.string()
        .valid("Broiler", "Layer", "Country Chicken")
        .required(),
      daily_egg_production: Joi.number().min(0).precision(2).optional(),
      feed_type: Joi.string()
        .valid("Commercial Feed", "Homegrown", "Mixed")
        .required(),
    });
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
    const poultrySchema = Joi.object({
      id: Joi.string().required(),
      farm_capacity: Joi.number().integer().min(0).required(),
      current_stock: Joi.number().integer().min(0).required(),
      poultry_type: Joi.string()
        .valid("Broiler", "Layer", "Country Chicken")
        .required(),
      daily_egg_production: Joi.number().min(0).precision(2).optional(),
      feed_type: Joi.string()
        .valid("Commercial Feed", "Homegrown", "Mixed")
        .required(),
    });
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
module.exports = {
  createOrUpdatePoultryController,
  getAllDetailsController,
  getByIdController,
  createOrUpdatePoultryAgentController,
  getAllDetailsAgentController,
};
