const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// POST /api/messages  (public — formulaire contact)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    const msg = await Message.create({ name, email, message });
    res.status(201).json({ success: true, message: "Message envoyé avec succès" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/messages  (admin)
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/messages/:id/read  (admin — marquer comme lu)
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: "Message introuvable" });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/messages/:id  (admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message supprimé" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
