const express = require('express');
const Community = require("../models/community");
const { auth } = require('../middleware');
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const exists = await Community.findOne({ user: req.user._id });

    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const { name, phone, email, location, coord} = req.body;

    const joined = new Community({
      name,
      phone,
      email,
      location,
      coordinates:coord,
      user: req.user._id,
    });

    await joined.save();

    res.status(200).json({ success: true, message: 'You are now a member of the community' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
