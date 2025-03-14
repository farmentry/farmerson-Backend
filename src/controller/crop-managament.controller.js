const Joi = require("joi");
const { createCropDetailsModel } = require("../model/crop-managament.model");

const createCropDetails = async (request, response) => {
  try {
    const cropSchema = Joi.object({
      userId: Joi.string().required(),
      cropName: Joi.string().required(),
      cropVariety: Joi.string().required(),
      sowingDate: Joi.date().required(),
      expectedHarvestDate: Joi.date().required(),
      currentGrowthStage: Joi.string()
        .valid("Seedling", "Vegetative", "Flowering", "Maturity", "Harvest")
        .required(),
      totalCultivatedArea: Joi.number().required(),
      expectedYield: Joi.number().required(),
      fertilizersUsed: Joi.string().allow(""),
      pesticidesUsed: Joi.string().allow(""),
      marketPricePerQuintal: Joi.number().optional(),
    });

    const { error } = cropSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }

    const responseData = await createCropDetailsModel(request.body);
    return response.status(responseData.statusCode).json(responseData);
  } catch (error) {
    console.log("Controller Error:", error);
    return response.status(500).json({
      statusCode: 500,
      controllerError: error.message,
    });
  }
};

module.exports = { createCropDetails };
