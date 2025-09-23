const {mongoose,localMongoose} = require("../UserApp/backend/db/mongoose");

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

UserSchema.plugin(localMongoose,{ usernameField: 'email',
  usernameQueryFields: ['email'],
  usernameLowerCase: true,
  usernameUnique: false });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
