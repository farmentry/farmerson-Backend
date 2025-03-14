const { createCropDetailsModel } = require("../model/crop-managament.model");
const { cropSchema } = require("../utils/crop-schema");
const createCropDetails = async (request, response) => {
  try {
    // Validate request body
    const { error } = cropSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        statusCode: 400,
        errors: error.details.map((err) => err.message),
      });
    }
    const responseData = await createCropDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};

module.exports = { createCropDetails };
