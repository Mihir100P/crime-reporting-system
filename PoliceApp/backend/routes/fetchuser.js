const express = require("express");
const router = express.Router();
const User = require("../../../SharedModels/user");
const { PoliceAuth } = require("../middleware");

router.get("/:id", PoliceAuth,async (req,res) => {
    const {id} = req.params;
    try{
        const result = await User.findById(id);
        if(result){
            return res.status(200).json({ success: true, result });
        }
        else{
            return res.status(404).json({ success: false, message: "No user found" });
        }
    }
    catch (err) {
    console.error("Error :", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;