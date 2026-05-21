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
  imageUrl:    { type: String, default: null },
  screenshots: [{ type: String }],
  summary:     { type: String, default: "" },
  featureDetails: [{
    name:        { type: String },
    description: { type: String },
  }],
  order:       { type: Number, default: 0 },
  published:   { type: Boolean, default: true },
}, { timestamps: true });

projectSchema.index({ published: 1, type: 1, order: 1, createdAt: -1 });
projectSchema.index({ published: 1 });

module.exports = mongoose.model("Project", projectSchema);