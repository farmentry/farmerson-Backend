const {
  userRegisterModel,
  userLoginModel,
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

module.exports = { registerUserController, loginUserController };
