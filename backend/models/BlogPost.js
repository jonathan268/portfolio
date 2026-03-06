const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, unique: true },
  excerpt:   { type: String, required: true },
  content:   { type: String, required: true },   // Markdown
  tag:       { type: String, required: true, trim: true },
  readTime:  { type: String, default: "5 min" },
  published: { type: Boolean, default: false },
  cover:     { type: String, default: null },     // URL image optionnelle
}, { timestamps: true });

blogSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("BlogPost", blogSchema);
