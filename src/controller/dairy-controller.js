const Joi = require("joi");
const {
  createOrUpdateDailyModel,
  getAllDailyDetailsModel,
  getDailyByIdModel,
} = require("../model/dairy-model");

const createOrUpdateDailyController = async (req, res) => {
  try {
    const cattleSchema = Joi.object({
      id: Joi.string().required(),
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
    // const { error } = cattleSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     statusCode: 400,
    //     errors: error.details.map((err) => err.message),
    //   });
    // }
    const responseData = await createOrUpdateDailyModel(req, res);
    return responseData;
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};

const getAllDailyDetailsController = async (request, response) => {
  try {
    const responseData = await getAllDailyDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const getDailyByIdController = async (request, response) => {
  try {
    const responseData = await getDailyByIdModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
module.exports = {
  createOrUpdateDailyController,
  getAllDailyDetailsController,
  getDailyByIdController,
};
