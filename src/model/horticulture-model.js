const supabase = require("../configaration/db.config");

const addPlantationModel = async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileno } = req.body;
    console.log(email);
    return res.status(200).json({
      statusCode: 200,
      message: "Crop details created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};

module.exports = { addPlantationModel };
