const jwt = require("jsonwebtoken");
const { ENCRYPTION_KEY } = process.env;
const decodeToken = async (authToken) => {
  console.log(">>>>>>>>>a", authToken);
  try {
    const token = authToken.split(" ")[1].toString().trim();
    let decoded = jwt.verify(token, ENCRYPTION_KEY.trim());
    if (decoded) {
      return decoded;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};
module.exports = {
  decodeToken,
};
