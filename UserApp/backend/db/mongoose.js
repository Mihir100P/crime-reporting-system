const mongoose = require("mongoose");
const dotenv = require("dotenv");
const localMongoose = require("passport-local-mongoose");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Connection Error:", err));

module.exports = { mongoose, localMongoose };
