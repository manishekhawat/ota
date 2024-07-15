import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Directory where update bundles are stored
const updatesDir = path.join(__dirname, "updates");
console.log(updatesDir);
// Helper function to get the latest bundle file
const getLatestBundle = () => {
  const files = fs.readdirSync(updatesDir);
  const bundleFiles = files.filter((file) => file.endsWith(".bundle"));
  if (bundleFiles.length === 0) {
    throw new Error("No update bundles found");
  }

  // Assuming the bundles are named in a way that allows sorting to find the latest
  bundleFiles.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  const latestBundle = bundleFiles[0];
  const version = latestBundle.replace(".bundle", "");

  return {
    version,
    url: `http://192.168.1.2:3000/updates/${latestBundle}`,
    description: `Update version ${version}`,
  };
};

app.get("/api/latest-update", (req, res) => {
  try {
    const latestUpdate = getLatestBundle();
    console.log(latestUpdate);
    res.json(latestUpdate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/updates/:id", (req, res) => {
  const fileId = req.params.id; // Get the :id parameter from the URL
  const filePath = `${updatesDir}/${fileId}`; // Replace with your actual file path logic

  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
