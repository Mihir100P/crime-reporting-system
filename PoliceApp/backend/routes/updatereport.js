const express = require("express");
const router = express.Router();
const Report = require("../../../SharedModels/report");
const { PoliceAuth } = require("../middleware");

router.post("/:id", PoliceAuth, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const report = await Report.findById(id);

    if(!report) {
      return res.status(404).json({ success: false, message: "No report found" });
    }
    if(!status) {
      return res.status(400).json({ success: false, message: "Missing status field" });
    }

    report.status = status;
    await report.save();

    res.status(200).json({ success: true, report });
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
