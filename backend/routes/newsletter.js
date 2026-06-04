const router = require("express").Router();
const Newsletter = require("../models/Newsletter");
const auth = require("../middleware/auth");

// POST /api/newsletter — public subscribe
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email requis" });

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ success: true, message: "Réabonnement réussi !" });
      }
      return res.json({ success: true, message: "Vous êtes déjà inscrit !" });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: "Inscription réussie !" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/newsletter — admin list
router.get("/", auth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/newsletter/:id — admin delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const sub = await Newsletter.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Abonné introuvable" });
    res.json({ success: true, message: "Abonné supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
