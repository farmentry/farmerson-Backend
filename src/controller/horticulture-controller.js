const Joi = require("joi");
const {
  addOrUpdatePlantationModel,
  getByIdModel,
  getAllDetailsModel,
  addOrUpdatePlantationAgentModel,
  getAllDetailsAgentModel,
  deleteByIdModel,
} = require("../model/horticulture-model");

const addOrUpdatePlantationController = async (request, response) => {
  try {
    const horticultureSchema = Joi.object({
      id: Joi.string().required(),
      cropName: Joi.string().required(),
      variety: Joi.string().required(),
      plantingDate: Joi.date().required(),
      expectedYield: Joi.number().required(),
      growthStage: Joi.string()
        .valid("Seedling", "Vegetative", "Flowering", "Maturity", "Harvest")
        .required(),
      plantationArea: Joi.number().required(),
      cultivationType: Joi.string()
        .valid("Open Field", "Greenhouse", "Polyhouse")
        .required(),
      fertilizersUsed: Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.boolean()
      ),
      pesticidesUsed: Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.boolean()
      ),
    });
    const { error } = horticultureSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }

    const responseData = await addOrUpdatePlantationModel(request, response);
    return response.status(responseData.statusCode).json(responseData);
  } catch (error) {
    return response.status(500).json({
      statusCode: 500,
      error: error.message,
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
const addOrUpdatePlantationAgentController = async (request, response) => {
  try {
    const horticultureSchema = Joi.object({
      id: Joi.string().required(),
      cropName: Joi.string().required(),
      variety: Joi.string().required(),
      plantingDate: Joi.date().required(),
      expectedYield: Joi.number().required(),
      growthStage: Joi.string()
        .valid("Seedling", "Vegetative", "Flowering", "Maturity", "Harvest")
        .required(),
      plantationArea: Joi.number().required(),
      cultivationType: Joi.string()
        .valid("Open Field", "Greenhouse", "Polyhouse")
        .required(),
      fertilizersUsed: Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.boolean()
      ),
      pesticidesUsed: Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.boolean()
      ),
    });
    const { error } = horticultureSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }

    const responseData = await addOrUpdatePlantationAgentModel(
      request,
      response
    );
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusCode: 500,
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

const deleteByIdController = async (request, response) => {
  try {
    const responseData = await deleteByIdModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
module.exports = {
  addOrUpdatePlantationController,
  getByIdController,
  getAllDetailsController,
  addOrUpdatePlantationAgentController,
  getAllDetailsAgentController,
  deleteByIdController,
};
