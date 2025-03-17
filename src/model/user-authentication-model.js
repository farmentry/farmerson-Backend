const supabase = require("../configaration/db.config");
const handleRoute = require("../utils/request-handler");
const bcrypt = require("bcryptjs");
const sendEmailVerificationCode = require("../utils/send-mail");
const jwt = require("jsonwebtoken");

const userRegisterModel = async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileno } = req.body;
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (fetchError) {
      console.error("Supabase Fetch Error:", fetchError);
      return res.status(500).json({
        statusCode: 500,
        error: "Database error while checking existing user.",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email already exists",
      });
    }

    function generateOTP(limit) {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < limit; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    }

    const generateCode = generateOTP(4);

    const otp = sendEmailVerificationCode(email, generateCode);
    console.log(">>>>>>>>>>>>>>>>>>>", otp);
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: hashedPassword,
          mobile_no: mobileno,
          otp: generateCode,
        },
      ])
      .select();
    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return res.status(400).json({
        statusCode: 400,
        error: insertError.message,
      });
    }
    return res.status(201).json({
      statusCode: 201,
      message: "Registration successful",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};

const userLoginModel = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password, email,isemailverified")
      .eq("email", email)
      .single();
    console.log(user);
    if (userError || !user) {
      return res.status(401).json({
        statusCode: 401,
        error: "Invalid email or password",
      });
    }
    console.log(">>>>>>>>", user);
    const isPswTrue = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ email: user.email }, "HS256", {
      expiresIn: "1h",
    });
    console.log(isPswTrue);
    if (!isPswTrue) {
      return res.status(401).json({
        statusCode: 401,
        error: "Invalid email or password",
      });
    }
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_email", email)
      .single();
    const addressExists = !!addressData;
    res.status(200).json({
      statusCode: 200,
      email,
      addressExists,
      isemailverified: user.isemailverified,
      token,
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
    });
  }
};
const verificationOtpModel = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("otp, isemailverified")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        statusCode: 401,
        error: "User not found",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        statusCode: 400,
        error: "Invalid OTP",
      });
    }
    const { error: updateError } = await supabase
      .from("users")
      .update({
        isemailverified: true,
        otp: null,
      })
      .eq("email", email);
    if (updateError) {
      return res.status(500).json({
        statusCode: 500,
        error: "Failed to update user verification status",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "OTP Verification Success, Email Verified",
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
    });
  }
};
const userDetailsModel = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("otp, isemailverified")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        statusCode: 401,
        error: "User not found",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        statusCode: 400,
        error: "Invalid OTP",
      });
    }
    const { error: updateError } = await supabase
      .from("users")
      .update({
        isemailverified: true,
        otp: null,
      })
      .eq("email", email);
    if (updateError) {
      return res.status(500).json({
        statusCode: 500,
        error: "Failed to update user verification status",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "OTP Verification Success, Email Verified",
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
    });
  }
};

const getUserDetailsModel = async (req, res) => {
  try {
    const { email } = req.query;
    const { data, error } = await supabase
      .from("users")
      .select("first_name, last_name, mobile_no")
      .eq("email", email)
      .single();
    console.log(data);

    if (!data) {
      return res.status(404).json({
        statusCode: 404,
        error: "User details not found",
      });
    }
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({
      statusCode: 200,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};
const updateUserDetailsModel = async (req, res) => {
  try {
    const { email, dob } = req.body;
    console;
    console.log("Updating DOB for user:", email, "to:", dob);
    const { data, error } = await supabase
      .from("users")
      .update({ dob })
      .eq("email", email)
      .select()
      .maybeSingle();
    if (error) {
      console.error("Error updating DOB:", error);
      return res.status(500).json({
        statusCode: 500,
        error: error.message,
      });
    }
    if (!data) {
      return res.status(404).json({
        statusCode: 404,
        error: "User not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "User DOB updated successfully",
      data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      statusCode: 500,
      error: "Something went wrong",
    });
  }
};
module.exports = {
  userRegisterModel,
  userLoginModel,
  getUserDetailsModel,
  updateUserDetailsModel,
  verificationOtpModel,
  userDetailsModel,
};
