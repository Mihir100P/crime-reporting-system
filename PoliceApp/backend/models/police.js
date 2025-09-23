const mongoose = require('mongoose');
const localmongoose = require("passport-local-mongoose");

const stationSchema = new mongoose.Schema({
  StationName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

stationSchema.plugin(localmongoose,{ usernameField: 'StationName',
  usernameQueryFields: ['StationName'],
  usernameLowerCase: true,
  usernameUnique: false });
module.exports = mongoose.model('Police', stationSchema);