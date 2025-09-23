const mongoose = require('mongoose');
const localmongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  credits: { 
    type: Number, default: 0 
  },
});

UserSchema.plugin(localmongoose,{ usernameField: 'email',
  usernameQueryFields: ['email'],
  usernameLowerCase: true,
  usernameUnique: false });
module.exports = mongoose.model('User', UserSchema);