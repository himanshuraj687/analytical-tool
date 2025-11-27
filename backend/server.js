const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Multer config
const upload = multer({ dest: "uploads/" });

// Clean data helper
function cleanData(data) {
  let cleaned = data.filter(row =>
    Object.values(row).some(value => value !== "" && value !== null && value !== undefined)
  );

  let unique = [];
  let jsonStrings = new Set();

  cleaned.forEach(item => {
    let str = JSON.stringify(item);
    if (!jsonStrings.has(str)) {
      jsonStrings.add(str);
      unique.push(item);
    }
  });

  return unique;
}

// ================================
// 🚀 UPLOAD ROUTE (NO TOKEN NEEDED)
// ================================
app.post("/upload", upload.single("file"), (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", data => results.push(data))
    .on("end", () => {
      fs.unlinkSync(filePath);

      const cleanedData = cleanData(results);
      const summary = {
        rows: cleanedData.length,
        columns: cleanedData[0] ? Object.keys(cleanedData[0]).length : 0,
        sample: cleanedData.slice(0, 10)
      };

      res.json({ cleanedData, summary });
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
