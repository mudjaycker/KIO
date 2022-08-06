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
