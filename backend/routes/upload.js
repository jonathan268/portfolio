const router    = require("express").Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer    = require("multer");
const auth      = require("../middleware/auth");

// ── Cloudinary config ──────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer + Cloudinary storage ────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "portfolio/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 1200, height: 630, crop: "limit", quality: "auto:good" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Seules les images sont acceptées."), false);
  },
});

// ── POST /api/upload  (admin only) ─────────
router.post("/", auth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
  }
  res.json({
    success: true,
    url:      req.file.path,          // URL Cloudinary
    publicId: req.file.filename,
  });
});

// ── DELETE /api/upload  (admin only) ───────
// Supprime une image Cloudinary par son public_id
router.delete("/", auth, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ success: false, message: "publicId requis." });
  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Error handler multer ───────────────────
router.use((err, _req, res, _next) => {
  res.status(400).json({ success: false, message: err.message || "Erreur upload." });
});

module.exports = router;