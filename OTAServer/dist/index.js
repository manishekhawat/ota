"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
// Directory where update bundles are stored
const updatesDir = path_1.default.join(__dirname, "updates");
console.log(updatesDir);
// Helper function to get the latest bundle file
const getLatestBundle = () => {
    const files = fs_1.default.readdirSync(updatesDir);
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
    }
    catch (error) {
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
