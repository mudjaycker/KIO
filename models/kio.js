const mongoose = require("mongoose");

const kioUserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: false,
  },
  
  role: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: false,
  },
  
});

module.exports = mongoose.model("kios", kioUserSchema);
