const supabase = require("../configaration/db.config");
const handleRoute = require("../utils/request-handler");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const sendEmailVerificationCode = require("../utils/send-mail");
const { getUser } = require("../utils/authentication");
const jwt = require("jsonwebtoken");
const {
  farmTypes,
  soilTypes,
  waterSources,
  roles,
} = require("../utils/constants");
const userRegisterModel = async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileno, agent } = req.body;
    const user_id = req?.user?.user_id;
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
          role_id: agent ? 2 : 1,
          agent_id: user_id || null,
        },
      ])
      .select();
    console.log("data", data);
    const token = jwt.sign(
      {
        user_id: data[0].user_id,
        role: data[0].role_id == 2 ? "Agent" : "Farmer",
      },
      "HS256"
    );

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
      userid: data[0]?.user_id,
      token,
      role: data[0].role_id == 2 ? "Agent" : "Farmer",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};
const moreDetailsModel = async (req, res, fileUrl) => {
  try {
    const { userId } = req.params;
    const {
      state,
      district,
      mandal,
      village,
      pincode,
      date_of_birth,
      is_farmer,
      house_number,
    } = req.body;
    const image_ref_id = fileUrl?.split("/")[2];
    const { data: addressData, error: insertError } = await supabase
      .from("address")
      .insert([{ state, district, mandal, village, pincode, house_number }])
      .select()
      .single();
    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return res
        .status(400)
        .json({ statusCode: 400, error: insertError.message });
    }
    const { data: userData, error: updateError } = await supabase
      .from("users")
      .update({
        address_id: addressData.address_id,
        dob: date_of_birth,
        is_farmer,
        image_ref_id,
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return res
        .status(400)
        .json({ statusCode: 400, error: updateError.message });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Address saved successfully",
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    return res.status(500).json({ statusCode: 500, error: e.message });
  }
};
const createFarmingDetailsModel = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      return res
        .status(400)
        .json({ statusCode: 400, error: "User ID is missing" });
    }
    const {
      borewell_count,
      farm_size,
      farming_type,
      soil_type,
      water_source,
      land_owner_type,
    } = req.body;
    const farming_name = farming_type
      .map((type) =>
        Object.keys(farmTypes).find((key) => farmTypes[key] === type)
      )
      .join(",");
    const soil_name = soil_type
      .map((type) =>
        Object.keys(soilTypes).find((key) => soilTypes[key] === type)
      )
      .join(",");
    const water_sources = water_source
      .map((type) =>
        Object.keys(waterSources).find((key) => waterSources[key] === type)
      )
      .join(",");

    console.log("water_sources", water_sources);
    const { error: updateError } = await supabase
      .from("users")
      .update({
        borewell_count,
        farming_type: farming_name,
        soil_type: soil_name,
        water_source: water_sources,
        land_owner_type,
        farm_size,
      })
      .eq("user_id", user_id);
    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return res
        .status(400)
        .json({ statusCode: 400, error: updateError.message });
    }
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select()
      .eq("user_id", user_id)
      .single();
    if (fetchError) {
      console.error("Supabase Fetch Error:", fetchError);
      return res
        .status(400)
        .json({ statusCode: 400, error: fetchError.message });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Farming details updated successfully",
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
    });
  }
};

const userLoginModel = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password,user_id, email,address_id,isemailverified,role_id")
      .eq("email", email)
      .single();
    console.log(user);
    if (userError || !user) {
      return res.status(401).json({
        statusCode: 401,
        error: "Invalid email or password",
      });
    }
    const isPswTrue = await bcrypt.compare(password, user.password);
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role_id == 2 ? "Agent" : "Farmer" },
      "HS256"
    );
    console.log(isPswTrue);
    if (!isPswTrue) {
      return res.status(401).json({
        statusCode: 401,
        error: "Invalid email or password",
      });
    }
    const isUserAddressExist = !!user?.address_id;
    res.status(200).json({
      statusCode: 200,
      isemailverified: user?.isemailverified,
      isUserAddressExist,
      token,
      role: user.role_id == 2 ? "Agent" : "Farmer",
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
    console.log("email", email);
    const cleanedEmail = email.trim().toLowerCase();
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
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
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role_id == "2" ? "Agent" : "Farmer" },
      "HS256"
    );
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

const getUserByIdModel = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        user_id, first_name, last_name, dob, email, active, is_farmer, farming_type,image_ref_id, created_at,
        role: role_id (role_name),
        address: address_id (state, district, mandal, village, pincode),
        crops: crop_management!fk_user (
          crop_name, crop_variety, sowing_date, expected_harvest_date, 
          current_growth_stage, total_cultivated_area, expected_yield, 
          fertilizers_used, pesticides_used, market_price_per_quintal
        )
      `
      )
      .eq("user_id", user_id)
      .single();
    const { data: dairyDetails, error: dairyError } = await supabase
      .from("dairy_farming")
      .select("*")
      .eq("user_id", user_id);
    ``;
    const { data: poultryDetails, error: poultryError } = await supabase
      .from("poultry")
      .select("*")
      .eq("user_id", user_id);
    ``;
    const { data: horticultureDetails, error: horticultureError } =
      await supabase
        .from("horticulture_crops")
        .select("*")
        .eq("user_id", user_id);
    ``;
    if (error || !user) {
      return res.status(404).json({
        statusCode: 404,
        error: "User not found",
      });
    }
    user.farming_type = user.farming_type
      ? user.farming_type.split(",").map((type) => farmTypes[type])
      : [];
    const updatedUser = {
      ...user,
      avatar_url: `${process.env.BASE_URL_IMAGE}/${user?.image_ref_id}`,
    };
    res.status(200).json({
      statusCode: 200,
      message: "User retrieved successfully",
      data: updatedUser,
      dairyDetails: dairyDetails || [],
      poultryDetails: poultryDetails || [],
      horticultureDetails: horticultureDetails || [],
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
    });
  }
};
const forgotPasswordModel = async (req, res) => {
  try {
    const { email } = req.body;
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id, email, address_id")
      .eq("email", email)
      .single();
    if (userError || !user) {
      return res.status(401).json({
        statusCode: 401,
        error: "Invalid email",
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
    const psw = true;
    const otp = sendEmailVerificationCode(email, generateCode, psw);
    await supabase
      .from("users")
      .update({
        otp: generateCode,
      })
      .eq("email", email);
    res.status(200).json({
      statusCode: 200,
      message: "OTP has been  sent",
      id: user?.user_id,
    });
  } catch (e) {
    console.log(e);
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
    });
  }
};
const resetPasswordModel = async (req, res) => {
  try {
    const { id } = req.query;
    const { password, otp } = req.body;
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id, email, address_id, otp")
      .eq("user_id", id)
      .single();

    if (userError || !user) {
      return res.status(400).json({
        statusCode: 400,
        error: "User does not exist",
      });
    }
    console.log(">>>>>>>>>>", user.otp);
    console.log(">>>>>>>>>>", otp);
    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        statusCode: 400,
        error: "Invalid OTP",
      });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .update({ password: hashedPassword, otp: "" })
      .eq("user_id", user.user_id)
      .select()
      .maybeSingle();
    if (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({
        statusCode: 500,
        error: error.message,
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Password reset successfully",
    });
  } catch (e) {
    console.log(e);
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
const updateUserDetailsModel = async (req, res, fileUrl) => {
  try {
    const user_id = req.params.id;

    const getUserData = await getUser(user_id);

    if (!getUserData?.user) {
      return response.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const {
      state,
      district,
      mandal,
      village,
      pincode,
      date_of_birth,
      is_farmer,
      house_number,
      first_name,
      last_name,
      email,
      borewell_count,
      farm_size,
      farming_type,
      soil_type,
      water_source,
      land_owner_type,
    } = req.body;
    if (getUserData?.cultivated_area > farm_size) {
      return res.status(400).json({
        statusCode: 400,
        error: "Farm size should be greater than cultivated area",
      });
    }
    const farming_name = JSON.parse(farming_type)
      .map((type) =>
        Object.keys(farmTypes).find((key) => farmTypes[key] === type)
      )
      .join(",");
    const soil_name = JSON.parse(soil_type)
      .map((type) =>
        Object.keys(soilTypes).find((key) => soilTypes[key] === type)
      )
      .join(",");
    const water_sources = JSON.parse(water_source)
      .map((type) =>
        Object.keys(waterSources).find((key) => waterSources[key] === type)
      )
      .join(",");
    const image_id = fileUrl?.split("/")[2];
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name: first_name,
        last_name: last_name,
        email: email,
        dob: date_of_birth,
        image_ref_id: image_id,
        borewell_count,
        farming_type: farming_name,
        soil_type: soil_name,
        water_source: water_sources,
        land_owner_type,
        farm_size,
        is_farmer,
      })
      .eq("user_id", user_id)
      .select()
      .single();
    const { addressUpdate, updateError } = await supabase
      .from("address")
      .update({ state, district, mandal, village, pincode, house_number })
      .eq("address_id", data?.address_id)
      .select()
      .single();
    if (error) {
      console.error("Error updating DOB:", error);
      return res.status(500).json({
        statusCode: 500,
        error: error.message,
      });
    }
    // if (!data) {
    //   return res.status(404).json({
    //     statusCode: 404,
    //     error: "User not found",
    //   });
    // }
    res.status(200).json({
      statusCode: 200,
      message: "User Profile updated successfully",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      statusCode: 500,
      error: "Something went wrong",
    });
  }
};
const generateOtp = () => Math.floor(1000 + Math.random() * 9000);
const sendOtpEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mailto:jeevantest64@gmail.com",
      pass: "aora lfje anli ajnp",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP for verification is ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

const reSendOtpModel = async (req, res) => {
  const { email } = req.body;
  try {
    const now = new Date();
    const cleanedEmail = email.trim().toLowerCase();
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", cleanedEmail)
      .maybeSingle();
    console.log("Resending OTP to:", user);
    if (error || !user) {
      return res.status(404).json({ statusCode: 404, error: "User not found" });
    }
    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const updatedAt = user.updated_at ? new Date(user.updated_at) : null;
    const lastOtpTimestamp = user.otp_sent_at
      ? new Date(user.otp_sent_at)
      : null;

    if (!createdAt) {
      return res.status(400).json({
        statusCode: 400,
        error: "Invalid user timestamps. Please contact support.",
      });
    }
    if (!updatedAt) {
      console.warn("Warning: updated_at is null, treating it as first update.");
    }

    if (createdAt > now) {
      return res.status(400).json({
        statusCode: 400,
        error: "Invalid account creation date.",
      });
    }
    if (updatedAt > now) {
      return res.status(400).json({
        statusCode: 400,
        error: "Invalid last update timestamp.",
      });
    }
    if (lastOtpTimestamp && now - lastOtpTimestamp < 24 * 60 * 60 * 1000) {
      return res.status(429).json({
        statusCode: 429,
        error: "OTP already sent. Please try again after 24 hours.",
      });
    }
    const newOtp = generateOtp();
    const { error: updateError } = await supabase
      .from("users")
      .update({
        otp: newOtp,
        otp_sent_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("email", cleanedEmail);
    if (updateError) {
      return res.status(500).json({
        statusCode: 500,
        error: "Failed to update OTP",
      });
    }
    await sendOtpEmail(cleanedEmail, newOtp);
    return res.status(200).json({
      statusCode: 200,
      message: "OTP Resent Successfully",
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};
const getAllFarmersModel = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        user_id, first_name, last_name, dob, email,isemailverified, active, is_farmer,farm_size, farming_type,image_ref_id, created_at,
        role: role_id (role_name),
        address: address_id (state, district, mandal, village, pincode)
      `
      )
      .eq("agent_id", user_id);
    const UpdateData = Object.values(user).map((userInfo) => ({
      ...userInfo,
      farming_type: userInfo?.farming_type
        ?.split(",")
        .map((item) => farmTypes[item]),
      avatar_url: userInfo?.image_ref_id
        ? `${process.env.BASE_URL_IMAGE}${userInfo?.image_ref_id}`
        : "",
    }));
    res.status(200).json({
      statusCode: 200,
      message: "User retrieved successfully",
      data: UpdateData,
    });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({
      statusCode: 500,
      error: e.message,
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
  moreDetailsModel,
  getUserByIdModel,
  forgotPasswordModel,
  resetPasswordModel,
  createFarmingDetailsModel,
  reSendOtpModel,
  getAllFarmersModel,
};
