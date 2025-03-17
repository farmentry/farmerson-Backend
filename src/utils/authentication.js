const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const supabase = require("../configaration/db.config");
const { ENCRYPTION_KEY } = process.env;
const decodeToken = async (authToken) => {
  try {
    const token = authToken.split(" ")[1].trim();
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
const requiredToken = async (request, response, next) => {
  try {
    if (!request.headers["authorization"]) {
      response.status(401).send({
        status: 401,
        error: true,
        message: "You must Log-in first",
        originalInfo:
          "Header not found the token, authController=>requiredToken method",
      });
    } else {
      const authResult = await decodeToken(request.headers["authorization"]);
      console.log("authResult>>>>>>>>>>>>>>>>>", authResult);
      //   if (authResult.expiredAt) {
      //     response.status(406).send({
      //       status: 406,
      //       error: true,
      //       message: "Session Expired. Log-in Required",
      //       data: null,
      //     });
      //   } else
      if (authResult.email) {
        const { data: isUserVerified, error: userError } = await supabase
          .from("users")
          .select("first_name, email")
          .eq("email", authResult.email)
          .single();
        console.log(">>>>>>>>>>>>>>", isUserVerified);
        if (isUserVerified) {
          request["user"] = isUserVerified;
          request["user"].email = Number(request["user"].email);
          next();
        } else {
          const error = {
            status: 400,
            error: true,
            message: "User not verified",
            originalInfo:
              "User not verified, authController=>requiredToken method",
          };
          response.send(error);
        }
      } else {
        const error = {
          status: 400,
          error: true,
          message: "Invalid Access Token",
          originalInfo: "Token decoding failed!",
        };
        response.send(error);
      }
    }
  } catch (err) {
    console.log(err);
    const error = {
      status: 401,
      error: true,
      message: "Token is required to access this route!",
      originalInfo: err,
    };
    response.send(error);
  }
};

const requiredAdmin = async (request, response, next) => {
  try {
    if (!request.headers["authorization"]) {
      response.status(401).send({
        status: 401,
        error: true,
        message: "You must Log-in first",
        originalInfo:
          "Header not found the token, authController=>requiredToken method",
      });
    } else {
      const authResult = await decodeToken(request.headers["authorization"]);
      if (authResult) {
        if (authResult.role !== "admin") {
          const error = {
            status: 401,
            error: false,
            message: "Only Admin can access",
            data: null,
          };
          response.send(error);
        } else {
          const isUserVerified = await UserTable.findOne({
            where: {
              id: authResult.id,
              [or]: [
                {
                  phone: authResult.phone,
                },
                {
                  email: authResult.email,
                },
              ],
              role: authResult.role,
              status: 1,
            },
            raw: true,
          });
          if (isUserVerified) {
            request["user"] = isUserVerified;
            next();
          } else {
            const error = {
              status: 400,
              error: true,
              message: "User not verified",
              originalInfo:
                "User not verified, authController=>requiredToken method",
            };
            response.send(error);
          }
        }
      } else {
        const error = {
          status: 400,
          error: true,
          message: "Invalid Access Token",
          originalInfo: "Token decoding failed!",
        };
        response.send(error);
      }
    }
  } catch (err) {
    const error = {
      status: 401,
      error: true,
      message: "Token is required to access this route!",
      originalInfo: err,
    };
    response.send(error);
  }
};

module.exports = {
  requiredToken,
  requiredAdmin,
};
