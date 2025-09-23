const express = require("express");
const router = express.Router();
const Report = require("../../../SharedModels/report");
const { auth } = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload  = multer({storage});

router.post("/",auth,upload.array("media"), async (req, res) => {
  try {
    const { title, description, incidentType, latitude, longitude, address } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const newReport = new Report({
      user: userId,
      title,
      description,
      incidentType,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address
      },
      mediaUrls: req.files.map((f) => f.path)
    });
    await newReport.save();
    res.status(201).json({ success: true, report: newReport });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.get("/:id", auth , async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (report) {
      res.status(200).json({ success: true, report });
    } else {
      res.status(404).json({ success: false, message: "No report found" });
    }

  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
