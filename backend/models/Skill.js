const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  cat:   { type: String, required: true, trim: true },
  icon:  { type: String, default: "🛠" },
  color: { type: String, enum: ["primary","secondary","accent"], default: "primary" },
  items: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);
