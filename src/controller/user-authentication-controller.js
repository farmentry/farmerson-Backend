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
} = require("../model/user-authentication-model");
const registerUserController = async (request, response) => {
  try {
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
};
