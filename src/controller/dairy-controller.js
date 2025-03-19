const Joi = require("joi");
const { createDailyModel } = require("../model/dairy-model");

const createDailyController = async (req, res) => {
  try {
    // Joi validation schema
    const cattleSchema = Joi.object({
      cattleType: Joi.string()
        .valid("Cow", "Buffalo", "Goat", "Sheep")
        .required(),
      breed: Joi.string().required(),
      totalCattle: Joi.number().min(0).required(),
      milkProduction: Joi.number().min(0).required(),
      feedingType: Joi.string()
        .valid("Grazing", "Stall-fed", "Mixed")
        .required(),
    });
    // Validate request body
    const { error } = cattleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }
    const responseData = await createDailyModel(req, res);
    // Send success response
    return res.status(200).json({
      responseData,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      statusCode: 500,
      error: error.message, // Only send error message
    });
  }
};

module.exports = { createDailyController };
