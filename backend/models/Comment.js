const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blogPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
    author: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false }, // Modération
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comment", commentSchema);
