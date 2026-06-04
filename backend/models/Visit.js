const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  path:       { type: String, required: true },
  visitorId:  { type: String, required: true },
  timestamp:  { type: Date,   default: Date.now },
}, { timestamps: true });

visitSchema.index({ timestamp: -1 });
visitSchema.index({ visitorId: 1, timestamp: -1 });

module.exports = mongoose.model("Visit", visitSchema);
