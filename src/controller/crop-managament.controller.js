const Joi = require("joi");
const {
  createOrUpdateCropDetailsModel,
  getCropDetailsModel,
  getCropByIdModel,
} = require("../model/crop-managament.model");
const createOrUpdateCropDetailsController = async (request, response) => {
  try {
    const cropSchema = Joi.object({
      cropId: Joi.string().required(),
      cropName: Joi.string().required(),
      cropVariety: Joi.string().required(),
      sowingDate: Joi.date().required(),
      expectedHarvestDate: Joi.date().required(),
      currentGrowthStage: Joi.string()
        .valid("Seedling", "Vegetative", "Flowering", "Maturity", "Harvest")
        .required(),
      totalCultivatedArea: Joi.number().positive().required(),
      expectedYield: Joi.number().positive().required(),
      fertilizersUsed: Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.boolean()
      ),
      pesticidesUsed: Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.boolean()
      ),

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
    await createOrUpdateCropDetailsModel(request, response);
  } catch (error) {
    console.error("Controller Error:", error);
    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllCropDetailsController = async (request, response) => {
  try {
    const responseData = await getCropDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const getCropByIdController = async (request, response) => {
  try {
    const responseData = await getCropByIdModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
module.exports = {
  createOrUpdateCropDetailsController,
  getAllCropDetailsController,
  getCropByIdController,
};
