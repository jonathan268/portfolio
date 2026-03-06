const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const auth = require("../middleware/auth");

// ── PUBLIC ──────────────────────────────────

// GET /api/blog
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .select("-content")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ success: false, message: "Article introuvable" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN ───────────────────────────────────

// GET /api/blog/admin/all
router.get("/admin/all", auth, async (req, res) => {
  try {
    const posts = await BlogPost.find().select("-content").sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/admin/:id  (avec contenu pour édition)
router.get("/admin/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Article introuvable" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog
router.post("/", auth, async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/blog/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: "Article introuvable" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Article introuvable" });
    res.json({ success: true, message: "Article supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
