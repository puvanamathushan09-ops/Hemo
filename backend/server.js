require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const userRoutes = require("./routes/userRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const donationRoutes = require("./routes/donationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());
// Register routes
app.use("/users", userRoutes);
app.use("/hospitals", hospitalRoutes);
app.use("/blood-requests", bloodRequestRoutes);
app.use("/donations", donationRoutes);
app.use("/notifications", notificationRoutes);

// JSON parse error handler (returns 400 with a helpful message)
app.use((err, req, res, next) => {
  if (!err) return next();
  const isBodyParserError = err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err);
  if (isBodyParserError) {
    return res.status(400).json({ error: 'Invalid JSON payload', message: err.message });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server is BONDED to Port: ${PORT}`);
  console.log(`🔗 Local Access: http://localhost:${PORT}`);
});

const testConnection = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(1);

  if (error) {
    console.log("❌ Database connection failed:", error.message);
  } else {
    console.log("✅ Database connected successfully");
  }
};

testConnection();