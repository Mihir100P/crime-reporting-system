const mongoose = require('mongoose');

const CommunityMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  phone: String,
  email: String,
  location: String,
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunityMember', CommunityMemberSchema);
