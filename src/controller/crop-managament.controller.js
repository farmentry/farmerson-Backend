const Joi = require("joi");
const { createCropDetailsModel } = require("../model/crop-managament.model");

const createCropDetails = async (request, response) => {
  try {
    // Define validation schema
    const cropSchema = Joi.object({
      cropName: Joi.string().required(),
      cropVariety: Joi.string().required(),
      sowingDate: Joi.date().required(),
      expectedHarvestDate: Joi.date().required(),
      currentGrowthStage: Joi.string()
        .valid("Seedling", "Vegetative", "Flowering", "Maturity", "Harvest")
        .required(),
      totalCultivatedArea: Joi.number().positive().required(),
      expectedYield: Joi.number().positive().required(),
      fertilizersUsed: Joi.string().allow(""),
      pesticidesUsed: Joi.string().allow(""),
      marketPricePerQuintal: Joi.number().optional(),
    });

    // Validate request body
    const { error } = cropSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }

    // Call model function
    await createCropDetailsModel(request, response);
  } catch (error) {
    console.error("Controller Error:", error);
    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { createCropDetails };
