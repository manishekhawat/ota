"use strict";
exports.__esModule = true;
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var app = (0, express_1["default"])();
var PORT = process.env.PORT || 3000;
// Directory where update bundles are stored
var updatesDir = path_1["default"].join(__dirname, "updates");
// Helper function to get the latest bundle file
var getLatestBundle = function () {
    var files = fs_1["default"].readdirSync(updatesDir);
    var bundleFiles = files.filter(function (file) { return file.endsWith(".bundle"); });
    if (bundleFiles.length === 0) {
        throw new Error("No update bundles found");
    }
    // Assuming the bundles are named in a way that allows sorting to find the latest
    bundleFiles.sort(function (a, b) { return b.localeCompare(a, undefined, { numeric: true }); });
    var latestBundle = bundleFiles[0];
    var version = latestBundle.replace(".bundle", "");
    return {
        version: version,
        url: "https://example.com/updates/".concat(latestBundle),
        description: "Update version ".concat(version)
    };
};
app.get("/api/latest-update", function (req, res) {
    try {
        var latestUpdate = getLatestBundle();
        console.log(latestUpdate);
        res.json(latestUpdate);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
