const supabase = require("../configaration/db.config");
 const userRegisterModel = async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileno } = req.body;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            // mobile_no: mobileno,
          },
          /* emailRedirectTo: "https://localhost:5000/auth/callback", */ // Change to your frontend
        },
      });
      if (error) {
        console.error("Auth Error:", error);
        return res.status(400).json({ error: error.message });
      }
      const { error: insertError } = await supabase.from("users").insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          // user_type: 'customer', // Default user type
          password: password,
          mobile_no: mobileno,// Ideally, this should be hashed
        },
      ]);
      if (insertError) {
        return res.status(400).json({
          statusCode: 400,
          error: insertError.message,
        });
      }
      return res.status(201).json({
        statusCode: 201,
        message: "Registration successful",
      });
    } catch (e) {
      return res.status(500).json({
        statusCode: 500,
        error: e.message,
      });
    }
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login Error:", error.message);
      return res.status(401).json({ 
        statusCode: 401,
        error: error.message });
    }
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_email', email)
      .single();
    const addressExists = !!addressData;
    res.status(200).json({ 
        statusCode: 200,
        email, addressExists });
  } catch (e) {
    console.error("Server Error:", e.message);
    res.status(500).json({ 
        statusCode: 500,
        error: e.message });
  }
  };  
module.exports = { userRegisterModel ,userLoginModel};