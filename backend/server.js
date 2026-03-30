require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));

// Rate limiter on public write routes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use("/api/messages", limiter);
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

// ── Routes ──────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/upload",   require("./routes/upload"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/blog",     require("./routes/blog"));
app.use("/api/skills",   require("./routes/skills"));
app.use("/api/messages", require("./routes/messages"));

// ── Health check ────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── 404 handler ─────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Error handler ───────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── MongoDB + Listen ────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });