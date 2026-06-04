const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const { notifySubscribers } = require("../services/notifier");

// ── PUBLIC ──────────────────────────────────

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { published: true };
    if (type && type !== "all") filter.type = type;
    const projects = await Project.find(filter)
      .select("name tagline description type imageUrl stack featured live github order createdAt")
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, published: true });
    if (!project) return res.status(404).json({ success: false, message: "Projet introuvable" });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN ───────────────────────────────────

// GET /api/projects/admin/all
router.get("/admin/all", auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects
router.post("/", auth, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    if (project.published) {
      notifySubscribers({
        type: "project",
        title: project.name,
        excerpt: project.tagline || project.summary || project.name,
        url: `/projects/${project._id}`,
      }).catch(() => {});
    }
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const previous = await Project.findById(req.params.id);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: "Projet introuvable" });

    const wasPublished = previous?.published;
    const nowPublished = project.published;
    if (!wasPublished && nowPublished) {
      notifySubscribers({
        type: "project",
        title: project.name,
        excerpt: project.tagline || project.summary || project.name,
        url: `/projects/${project._id}`,
      }).catch(() => {});
    }

    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Projet introuvable" });
    res.json({ success: true, message: "Projet supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
