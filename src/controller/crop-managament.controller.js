const Joi = require("joi");
const { createCropDetailsModel } = require("../model/crop-managament.model");

const createCropDetails = async (request, response) => {
  try {
    const cattleSchema = Joi.object({
      cattleType: Joi.string()
        .valid("Cow", "Buffalo", "Goat", "Sheep")
        .required(),
      breed: Joi.string().required(),
      milkProduction: Joi.number().min(0).required(),
      feedingType: Joi.string()
        .valid("Grazing", "Stall Feeding", "Mixed")
        .required(),
    });

    const { error } = cattleSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }
    const responseData = await createCropDetailsModel(request.body);
    return response.status(200).json({
      statusCode: 200,
      message: "Crop details created successfully",
      data: responseData,
    });
  } catch (error) {
    return response.status(500).json({
      statusCode: 500,
      controllerError: error.message,
    });
  }
};

module.exports = { createCropDetails };
