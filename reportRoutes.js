const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Report = require("../models/reportModel");

const router = express.Router();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * POST - Create new report
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, city, street, latitude, longitude } = req.body;

    if (!title || !latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Title, latitude, and longitude are required." });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid latitude or longitude." });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}` // public-facing path
      : null;

    const report = new Report({
      title,
      city,
      street,
      location: { lat, lng },
      status: "Pending",
      imagePath,
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error("Report creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET - Fetch all reports
 */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE - Delete a report by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ message: "Report deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;