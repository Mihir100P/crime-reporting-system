const express = require("express");
const cors = require("cors");
const axios = require("axios");

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post("/", async (req, res) => {
  const { location, message } = req.body;

  if (!location || !message) {
    return res.status(400).json({
      success: false,
      error: "Location and message are required",
    });
  }

  try {
    await axios.post("http://localhost:5000/api/alerts", { location, message }, {
      headers: { "Content-Type": "application/json" },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error while sending alert:", err.message);
    res.status(500).json({ success: false, error: "Failed to send alert" });
  }
});

module.exports = router;
