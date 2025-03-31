const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const handleRoute = require("../utils/request-handler");
const { requiredToken } = require("../utils/authentication");
const {
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
} = require("../controller/user-authentication-controller");

const uploadDir = path.join(__dirname, "..", "public");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });
// Home page route.
router.post("/register", async (req, res) => {
  try {
    const response = await registerUserController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.post(
  "/personal-information/:userId",
  upload.single("file"),
  async (req, res) => {
    try {
      const fileUrl = req.file ? `/public/${req.file.filename}` : null;
      await moreDetailsController(req, res, fileUrl);
    } catch (error) {
      console.error("Router Error:", error.message);
      res.status(500).json({
        statusCode: 500,
        routerError: error.message,
      });
    }
  }
);
router.post("/verify-otp", async (req, res) => {
  try {
    const response = await verificationOtpController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const response = await loginUserController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.post("/user-details", async (req, res) => {
  try {
    const response = await userDetailsController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.post("/farming-details", requiredToken, async (req, res) => {
  try {
    const response = await createFarmingDetailsController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.get("/get-user", requiredToken, async (req, res) => {
  try {
    const response = await getUserByIdController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.get("/forgot-password", async (req, res) => {
  try {
    const response = await forgotPasswordController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.get("/forgot-password", async (req, res) => {
  try {
    const response = await forgotPasswordController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.get("/reset-password", async (req, res) => {
  try {
    await resetPasswordController(req, res);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.post("/re-send", reSendOtpController);
router.get("/user-details", async (req, res) => {
  try {
    const response = await getUserDetailsController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.put("/api/users", async (req, res) => {
  try {
    const response = await updateUserDetailsController(req, res);
    return response;
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      Routererror: error.message,
    });
  }
});
router.post(
  "/api/users/profile-picture",
  upload.single("profile_picture"),
  handleRoute(async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      console.log("Uploading profile picture for user:", email);

      // Store the image directly in Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("profile_pictures")
        .upload(file.originalname, file.buffer);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      // Get the public URL of the uploaded image
      const imageUrl = supabase.storage
        .from("profile_pictures")
        .getPublicUrl(file.originalname);

      // Update user record with profile picture URL
      const { data: userData, error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: imageUrl })
        .eq("email", email)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating user profile:", updateError);
        return res.status(500).json({ error: updateError.message });
      }

      res.status(201).json(userData);
    } catch (error) {
      console.error("Error handling profile picture:", error);
      res.status(500).json({ error: error.message });
    }
  })
);
module.exports = router;
