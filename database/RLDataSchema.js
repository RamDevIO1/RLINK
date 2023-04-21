require("../config.js");
const config = require('../config');
const mongoose = require("mongoose");

const RLUserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String },
});

const RLUsers = mongoose.model("RLUsers", RLUserSchema);

module.exports = {
  RLUsers
}