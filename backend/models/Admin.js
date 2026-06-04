const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  profileImage: { type: String, default: null },

  name:     { type: String, default: "Jonathan" },
  tagline:  { type: String, default: "Développeur fullstack basé à Yaoundé" },
  bio:      { type: String, default: "" },
  titles:   [{ type: String }],
  techStack: [{ type: String }],
  stats: [{
    label: { type: String },
    value: { type: String },
  }],
  socialLinks: {
    github:   { type: String, default: "" },
    linkedin: { type: String, default: "" },
    email:    { type: String, default: "" },
  },
  available: { type: Boolean, default: true },
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
