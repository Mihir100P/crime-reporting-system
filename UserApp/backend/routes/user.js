const express = require('express');
const router = express.Router();
const  User = require("../models/user");
const passport = require('passport');
const { auth } = require('../middleware');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({ name, email, phoneNumber });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'Login failed after registration' });
      }

      return res.status(201).json({
        success: true,
        user: {
          _id: registeredUser._id,
          name: registeredUser.name,
          email: registeredUser.email,
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.post('/login', (req, res, next) => {
   const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (!user) return res.status(400).json({ success: false, message: info?.message || 'Invalid credentials' });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Login failed' });

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    });
  })(req, res, next);
});

router.get("/logout",(req,res)=>{
   req.logout((err)=>{
        if(err){
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        else{
        return res.status(200).json({
        success: true,
        message:"logout successfully!",
      });
        }
    });
});

router.get("/me", auth, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});


router.get('/profile/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put("/update-points/:id",auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.credits += req.body.points; 
    await user.save();

    res.json({ credits: user.credits }); 
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;