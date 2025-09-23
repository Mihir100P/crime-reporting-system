const express = require("express");
const router = express.Router();
const Report = require("../../../SharedModels/report");
const Police = require("../models/police");
const { PoliceAuth } = require("../middleware");

router.get("/", PoliceAuth, async (req, res) => {
  try {
    const police = await Police.findById(req.user._id);
    if (!police || !police.coordinates) {
      return res.status(400).json({ success: false, message: "Police coordinates missing" });
    }

     const policeCoords = [Number(police.coordinates.lng), Number(police.coordinates.lat)];

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: policeCoords,
          },
          $maxDistance: 50 * 1000, // 5 km (converted to meters)
        },
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(reports);

  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
});

router.get("/:id", PoliceAuth, async (req, res) => {
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
