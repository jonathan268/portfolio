const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// ── PUBLIC ──────────────────────────────────

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { published: true };
    if (type && type !== "all") filter.type = type;
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
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
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: "Projet introuvable" });
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
