const Joi = require("joi");

const {
  userRegisterModel,
  userLoginModel,
  getUserDetailsModel,
  updateUserDetailsModel,
  verificationOtpModel,
  userDetailsModel,
  moreDetailsModel,
  getUserByIdModel,
  forgotPasswordModel,
  resetPasswordModel,
  createFarmingDetailsModel,
  reSendOtpModel,
} = require("../model/user-authentication-model");

const registerUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  firstName: Joi.string()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "First name should contain only letters",
      "any.required": "First name is required",
    }),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "Last name should contain only letters",
      "any.required": "First name is required",
    }),
  mobileno: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10-15 digits long",
      "any.required": "Mobile number is required",
    }),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 special character",
      "any.required": "Password is required",
    }),
});

const registerUserController = async (request, response) => {
  try {
    const { error } = registerUserSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      return response.status(400).json({
        statusbar: 400,
        validationErrors: error.details.map((err) => err.message),
      });
    }
    const responseData = await userRegisterModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};

const moreDetailsController = async (req, res, fileUrl) => {
  try {
    await moreDetailsModel(req, res, fileUrl);
  } catch (error) {
    console.error("Controller Error:", error.message);
    return res.status(500).json({
      statusCode: 500,
      controllerError: error.message,
    });
  }
};

const loginUserController = async (request, response) => {
  try {
    const responseData = await userLoginModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};

const verificationOtpController = async (request, response) => {
  try {
    const responseData = await verificationOtpModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};

const reSendOtpController = async (request, response) => {
  try {
    const responseData = await reSendOtpModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const userDetailsController = async (request, response) => {
  try {
    const responseData = await userDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const createFarmingDetailsController = async (request, response) => {
  try {
    const responseData = await createFarmingDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const getUserByIdController = async (request, response) => {
  try {
    const responseData = await getUserByIdModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const forgotPasswordController = async (request, response) => {
  try {
    const responseData = await forgotPasswordModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const resetPasswordController = async (request, response) => {
  try {
    const responseData = await resetPasswordModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};

const getUserDetailsController = async (request, response) => {
  try {
    const responseData = await getUserDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};
const updateUserDetailsController = async (request, response) => {
  try {
    const responseData = await updateUserDetailsModel(request, response);
    return responseData;
  } catch (error) {
    return response.status(500).json({
      statusbar: 500,
      controllererror: error.message,
    });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  getUserDetailsController,
  updateUserDetailsController,
  verificationOtpController,
  userDetailsController,
  moreDetailsController,
  getUserByIdController,
  forgotPasswordController,
  resetPasswordController,
  createFarmingDetailsController,
  reSendOtpController,
};
