const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email et mot de passe requis" });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Identifiants incorrects" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ success: true, data: { token, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, (req, res) => {
  const admin = req.admin;
  res.json({
    success: true, data: {
      email: admin.email,
      profileImage: admin.profileImage,
      name: admin.name,
      tagline: admin.tagline,
      bio: admin.bio,
      titles: admin.titles,
      techStack: admin.techStack,
      stats: admin.stats,
      socialLinks: admin.socialLinks,
      available: admin.available,
    }
  });
});

// PUT /api/auth/profile
router.put("/profile", auth, async (req, res) => {
  try {
    const allowed = [
      "profileImage", "name", "tagline", "bio", "titles",
      "techStack", "stats", "socialLinks", "available",
    ];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }

    const admin = await Admin.findByIdAndUpdate(req.admin._id, update, { new: true });
    res.json({ success: true, data: { email: admin.email, profileImage: admin.profileImage } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
