const Joi = require("joi");
const { addPlantationModel } = require("../model/horticulture-model");

const addPlantationController = async (request, response) => {
  try {
    const horticultureSchema = Joi.object({
      userId: Joi.number().required(),
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
      pesticidesUsed: Joi.string().allow(""),
      fertilizersUsed: Joi.string().allow(""),
    });
    const { error } = horticultureSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }
    const responseData = await addPlantationModel(request.body);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};

module.exports = { addPlantationController };
