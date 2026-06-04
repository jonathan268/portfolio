const router = require("express").Router();
const crypto = require("crypto");
const Visit = require("../models/Visit");
const auth = require("../middleware/auth");

router.post("/track", async (req, res) => {
  try {
    const { path } = req.body;
    if (!path || typeof path !== "string") return res.status(400).json({ success: false, message: "Path is required" });

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "0.0.0.0";
    const ua = req.headers["user-agent"] || "unknown";
    const visitorId = crypto.createHash("sha256").update(ip + ua).digest("hex").slice(0, 16);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await Visit.findOne({
      visitorId,
      path,
      timestamp: { $gte: todayStart, $lte: todayEnd },
    });

    if (!existing) {
      await Visit.create({ path, visitorId });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Track error:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const pipeline = [
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const dailyVisits = await Visit.aggregate(pipeline);

    const totalVisits = dailyVisits.reduce((sum, d) => sum + d.count, 0);

    const uniqueVisitors = await Visit.distinct("visitorId", { timestamp: { $gte: startDate } });

    const topPages = await Visit.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const today = await Visit.countDocuments({
      timestamp: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    res.json({
      success: true,
      data: {
        totalVisits,
        uniqueVisitors: uniqueVisitors.length,
        today,
        dailyVisits: dailyVisits.map(d => ({ date: d._id, visits: d.count })),
        topPages: topPages.map(p => ({ path: p._id, visits: p.count })),
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;
