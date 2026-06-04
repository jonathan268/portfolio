const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  key:   { type: String, required: true, unique: true, trim: true },
  order: { type: Number, default: 0 },
  color: { type: String, default: "#00b4d8" },
}, { timestamps: true });

categorySchema.index({ order: 1 });

module.exports = mongoose.model("Category", categorySchema);
