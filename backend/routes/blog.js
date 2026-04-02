const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// ── ADMIN ROUTES (MUST BE BEFORE GENERIC :slug ROUTES) ───────

// GET /api/blog/admin/all
router.get("/admin/all", auth, async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .select("-content")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/admin/:id  (avec contenu pour édition)
router.get("/admin/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Article introuvable" });
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
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Article introuvable" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Article introuvable" });
    res.json({ success: true, message: "Article supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── COMMENTS ADMIN ROUTES ──────────────────────────

// GET /api/blog/admin/comments/all
router.get("/admin/comments/all", auth, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blogPostId", "title slug")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/blog/admin/comments/:id (approuver/rejeter commentaire)
router.put("/admin/comments/:id", auth, async (req, res) => {
  try {
    const { approved } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true },
    );
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Commentaire introuvable" });
    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/admin/comments/:id
router.delete("/admin/comments/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Commentaire introuvable" });
    res.json({ success: true, message: "Commentaire supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUBLIC ROUTES (MUST BE LAST) ───────────────

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

// GET /api/blog/:slug/comments
router.get("/:slug/comments", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Article introuvable" });

    const comments = await Comment.find({
      blogPostId: post._id,
      approved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog/:slug/comments (ajouter un commentaire)
router.post("/:slug/comments", async (req, res) => {
  try {
    const { author, email, content } = req.body;

    if (!author || !email || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Tous les champs sont requis" });
    }

    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Article introuvable" });

    const comment = await Comment.create({
      blogPostId: post._id,
      author,
      email,
      content,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/blog/comments/:id/like (toggle like on comment)
router.post("/comments/:id/like", async (req, res) => {
  try {
    const { likerEmail } = req.body;

    if (!likerEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email requis pour liker" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Commentaire introuvable" });

    const likeIndex = comment.likes.indexOf(likerEmail);

    if (likeIndex === -1) {
      // Like the comment
      comment.likes.push(likerEmail);
    } else {
      // Unlike the comment
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();
    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug (MUST BE LAST)
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Article introuvable" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
