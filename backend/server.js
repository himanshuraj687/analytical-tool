require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const User = require("./models/User");
const Dataset = require("./models/Dataset");

const app = express();

app.use(cors());
app.use(express.json());

// Multer config
const upload = multer({ dest: "uploads/" });

// Connect to MongoDB
connectDB();

// ================================
// 📝 REGISTER
// ================================
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check duplicates
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (existingUser) {
      if (existingUser.username === username.toLowerCase()) {
        return res.status(409).json({ error: "Username already taken" });
      }
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await User.create({ fullName, email, username, password });

    res.status(201).json({ message: "Account created successfully! Redirecting to login..." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ================================
// 🔐 LOGIN
// ================================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Demo user fallback
    if (username === "admin" && password === "123456") {
      return res.json({
        message: "Login successful",
        user: { username: "admin", fullName: "Admin User", email: "admin@demo.com" },
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      user: { username: user.username, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ================================
// 👤 GET PROFILE
// ================================
app.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (username === "admin") {
      return res.json({ username: "admin", fullName: "Admin User", email: "admin@demo.com", role: "Administrator", createdAt: "2025-01-01T00:00:00.000Z" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: "User",
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================================
// ✏️ UPDATE PROFILE
// ================================
app.put("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { fullName, email } = req.body;

    if (username === "admin") {
      return res.status(403).json({ error: "Cannot modify the demo account" });
    }

    if (!fullName && !email) {
      return res.status(400).json({ error: "Provide at least one field to update" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if email is taken by another user
    if (email) {
      const emailTaken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (emailTaken) return res.status(409).json({ error: "Email already in use by another account" });
      user.email = email.trim();
    }

    if (fullName) user.fullName = fullName.trim();
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: { username: user.username, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================================
// 🔒 CHANGE PASSWORD
// ================================
app.put("/change-password/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (username === "admin") {
      return res.status(403).json({ error: "Cannot change password of the demo account" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    user.password = newPassword; // will be hashed by pre-save hook
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Clean data helper
function cleanData(data) {
  let cleaned = data.filter((row) =>
    Object.values(row).some((value) => value !== "" && value !== null && value !== undefined)
  );

  let unique = [];
  let jsonStrings = new Set();

  cleaned.forEach((item) => {
    let str = JSON.stringify(item);
    if (!jsonStrings.has(str)) {
      jsonStrings.add(str);
      unique.push(item);
    }
  });

  return unique;
}

// ================================
// 🚀 UPLOAD ROUTE — parses CSV, cleans data, stores in MongoDB
// ================================
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results = [];
  const filePath = req.file.path;
  const originalName = req.file.originalname || "upload.csv";
  const uploaderUsername = req.body.username || "anonymous";

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("error", () => {
      fs.unlinkSync(filePath);
      res.status(500).json({ error: "Failed to parse CSV file" });
    })
    .on("end", async () => {
      fs.unlinkSync(filePath);

      if (results.length === 0) {
        return res.status(400).json({ error: "CSV file is empty or has no valid rows" });
      }

      const cleanedData = cleanData(results);
      const columnNames = cleanedData[0] ? Object.keys(cleanedData[0]) : [];

      const summary = {
        rows: cleanedData.length,
        columns: columnNames.length,
        columnNames,
        sample: cleanedData.slice(0, 10),
      };

      // Save dataset to MongoDB
      try {
        const user = await User.findOne({ username: uploaderUsername.toLowerCase() });

        const dataset = await Dataset.create({
          userId: user ? user._id : null,
          username: uploaderUsername,
          fileName: originalName,
          rows: summary.rows,
          columns: summary.columns,
          columnNames,
          cleanedData,
          summary,
        });

        res.json({ cleanedData, summary, datasetId: dataset._id });
      } catch (err) {
        console.error("Dataset save error:", err);
        // Still return data even if DB save fails
        res.json({ cleanedData, summary });
      }
    });
});

// ================================
// 📂 GET USER DATASETS (list)
// ================================
app.get("/datasets/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const datasets = await Dataset.find({ username: username.toLowerCase() })
      .select("fileName rows columns createdAt _id")
      .sort({ createdAt: -1 });

    res.json(datasets);
  } catch (err) {
    console.error("Datasets fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================================
// 📄 GET SINGLE DATASET
// ================================
app.get("/dataset/:id", async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    res.json(dataset);
  } catch (err) {
    console.error("Dataset fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================================
// 🗑️ DELETE DATASET
// ================================
app.delete("/dataset/:id", async (req, res) => {
  try {
    const dataset = await Dataset.findByIdAndDelete(req.params.id);
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    res.json({ message: "Dataset deleted successfully" });
  } catch (err) {
    console.error("Dataset delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================================
// 💓 HEALTH CHECK
// ================================
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
