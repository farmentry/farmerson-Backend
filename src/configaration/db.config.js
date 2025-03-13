const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
if (supabase) {
  console.log("Supabase client is initialized.");
} else {
  console.error("Supabase client failed to initialize.");
}
module.exports = supabase;
