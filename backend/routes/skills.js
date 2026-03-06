const router = require("express").Router();
const Skill = require("../models/Skill");
const auth = require("../middleware/auth");

// GET /api/skills  (public)
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills  (admin)
router.post("/", auth, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/skills/:id  (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ success: false, message: "Skill introuvable" });
    res.json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/:id  (admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill introuvable" });
    res.json({ success: true, message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
