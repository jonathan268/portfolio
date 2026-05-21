const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin introuvable" });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
};
