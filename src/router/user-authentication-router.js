const express = require("express");
const router = express.Router();
const handleRoute = require("../utils/request-handler");
const {
  registerUserController,
  loginUserController,
} = require("../controller/user-authentication-controller");
const multer = require("multer");
const upload = multer();
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
router.get("/api/user-details", async (req, res) => {
  const { email } = req.query;
  const { data, error } = await supabase
    .from("users")
    .select("first_name, last_name, mobile_no")
    .eq("email", email)
    .single();
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
});
router.post(
  "/api/users",
  handleRoute(async (req, res) => {
    const { email, dob } = req.body;
    console.log("Updating DOB for user:", email, "to:", dob);

    const { data, error } = await supabase
      .from("users")
      .update({ dob: dob })
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Error updating DOB:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  })
);
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
