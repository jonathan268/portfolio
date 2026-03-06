const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  tagline:     { type: String, required: true, trim: true },
  description: { type: String, required: true },
  features:    [{ type: String }],
  stack:       [{ type: String }],
  type:        { type: String, enum: ["saas","web","api"], required: true },
  featured:    { type: Boolean, default: false },
  live:        { type: String, default: null },
  github:      { type: String, default: null },
  order:       { type: Number, default: 0 },
  published:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
