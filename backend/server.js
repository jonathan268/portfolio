require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const Admin = require("./models/Admin");
const Category = require("./models/Category");
const Skill = require("./models/Skill");
const Project = require("./models/Project");

const app = express();

// ── Middleware ──────────────────────────────
app.use(compression());
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
app.use("/api/skills",     require("./routes/skills"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/messages",    require("./routes/messages"));
app.use("/api/newsletter", require("./routes/newsletter"));

// ── Health check ────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── Public profile ─────────────────────────
app.get("/api/profile", async (_, res) => {
  try {
    const admin = await Admin.findOne().select("email profileImage");
    res.json({ success: true, data: admin || { email: "", profileImage: null } });
  } catch {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ── 404 handler ─────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Error handler ───────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── MongoDB + Listen ────────────────────────
const PORT = process.env.PORT || 5000;

async function bootstrapData() {
  const adminExists = await Admin.countDocuments();
  if (!adminExists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL || "admin@portfolio.cm",
      password: process.env.ADMIN_PASSWORD || "Admin@2024!",
    });
    console.log("👤 Admin par défaut créé");
  }

  const categoryCount = await Category.countDocuments();
  if (!categoryCount) {
    await Category.insertMany([
      { name:"SaaS",     key:"saas",     order:1, color:"#00b4d8" },
      { name:"Web App",  key:"web",      order:2, color:"#48cae4" },
      { name:"API",      key:"api",      order:3, color:"#0096c7" },
      { name:"Desktop",  key:"desktop",  order:4, color:"#7b2d8e" },
      { name:"Mobile",   key:"mobile",   order:5, color:"#e76f51" },
    ]);
    console.log("📁 Catégories par défaut créées");
  }

  const skillCount = await Skill.countDocuments();
  if (!skillCount) {
    await Skill.insertMany([
      { cat:"Frontend", icon:"🖥",  color:"primary",   items:["React","Tailwind CSS","JavaScript"], order:1 },
      { cat:"Backend",  icon:"⚙️", color:"secondary",  items:["Node.js","Express","Laravel"],       order:2 },
      { cat:"Database", icon:"🗄",  color:"accent",     items:["MongoDB","MySQL"],                   order:3 },
      { cat:"Tools",    icon:"🛠",  color:"primary",    items:["Git","Docker","Postman"],             order:4 },
    ]);
    console.log("🛠️  Skills par défaut créés");
  }

  const projectCount = await Project.countDocuments();
  if (!projectCount) {
    await Project.insertMany([
      {
        name:"StockWise", tagline:"AI Inventory Management SaaS",
        description:"Application SaaS permettant aux entreprises de gérer leurs stocks et d'analyser leurs données grâce à l'intelligence artificielle.",
        summary:"StockWise est une solution SaaS complète d'aide à la gestion des stocks et d'analyse prédictive. Grâce à l'intelligence artificielle, l'application permet aux entreprises de toute taille d'optimiser leurs niveaux de stock, de prévoir la demande et de réduire les ruptures.",
        features:["Gestion produits & catégories","Suivi des ventes en temps réel","Dashboard analytics avancé","Alertes de stock automatiques","Analyse prédictive via IA"],
        featureDetails:[
          { name:"Gestion produits & catégories", description:"Interface complète de gestion des produits avec création, modification, suppression et organisation par catégories." },
          { name:"Suivi des ventes en temps réel", description:"Tableau de bord dynamique affichant les ventes en direct avec des graphiques interactifs." },
          { name:"Dashboard analytics avancé", description:"Analyses approfondies avec des métriques clés : chiffre d'affaires, marges, produits les plus vendus." },
          { name:"Alertes de stock automatiques", description:"Système de notifications intelligentes pour les seuils de stock minimum et les ruptures imminentes." },
          { name:"Analyse prédictive via IA", description:"Moteur d'IA intégré utilisant le machine learning pour prédire la demande future." },
        ],
        stack:["React","Node.js","Express","MongoDB","Gemini API"],
        type:"saas", featured:true, live:"#", github:"#", order:1, published:true,
      },
      {
        name:"Flexify", tagline:"Fitness & Workout Tracker",
        description:"Application web de suivi d'entraînements avec programmes personnalisés, statistiques de progression et suivi nutritionnel.",
        summary:"Flexify est une application complète de fitness qui permet aux utilisateurs de créer des programmes d'entraînement personnalisés et de suivre leurs performances.",
        features:["Création de programmes","Suivi des performances","Statistiques et graphiques","Suivi nutritionnel"],
        featureDetails:[
          { name:"Création de programmes", description:"Générateur de programmes d'entraînement personnalisés basés sur les objectifs, le niveau et les préférences." },
          { name:"Suivi des performances", description:"Enregistrement détaillé de chaque séance avec historique complet." },
          { name:"Statistiques et graphiques", description:"Visualisation avancée des données avec Chart.js." },
          { name:"Suivi nutritionnel", description:"Journal alimentaire avec base de données de plus de 5000 aliments." },
        ],
        stack:["React","Node.js","MongoDB","Chart.js"],
        type:"web", featured:false, live:"#", github:"#", order:2, published:true,
      },
      {
        name:"Academix", tagline:"School Management Platform",
        description:"Plateforme de gestion scolaire complète pour les établissements : élèves, notes, emplois du temps et communication.",
        summary:"Academix est une plateforme de gestion scolaire tout-en-un conçue pour les établissements d'enseignement.",
        features:["Gestion élèves & enseignants","Notes et bulletins automatisés","Emplois du temps dynamiques","Messagerie interne"],
        featureDetails:[
          { name:"Gestion élèves & enseignants", description:"Registre complet avec profils détaillés et suivi des présences." },
          { name:"Notes et bulletins automatisés", description:"Saisie des notes avec calcul automatique des moyennes et génération de bulletins." },
          { name:"Emplois du temps dynamiques", description:"Planificateur visuel avec glisser-déposer." },
          { name:"Messagerie interne", description:"Système de messagerie intégré avec notifications." },
        ],
        stack:["React","Laravel","MySQL","Tailwind"],
        type:"web", featured:false, live:"#", github:"#", order:3, published:true,
      },
      {
        name:"E-Commerce API", tagline:"RESTful API for Online Stores",
        description:"API REST complète pour boutiques e-commerce, avec auth JWT, gestion des commandes et paiement Mobile Money.",
        summary:"Une API REST robuste et sécurisée pour alimenter des boutiques e-commerce.",
        features:["Auth JWT + refresh tokens","CRUD produits, commandes, users","Intégration Mobile Money","Documentation Swagger"],
        featureDetails:[
          { name:"Auth JWT + refresh tokens", description:"Système d'authentification complet avec access et refresh tokens." },
          { name:"CRUD produits, commandes, users", description:"API RESTful complète avec pagination, filtrage et tri." },
          { name:"Intégration Mobile Money", description:"Support des principaux services Mobile Money africains." },
          { name:"Documentation Swagger", description:"Documentation interactive complète avec Swagger/OpenAPI." },
        ],
        stack:["Node.js","Express","MongoDB","JWT"],
        type:"api", featured:false, live:null, github:"#", order:4, published:true,
      },
    ]);
    console.log("🚀 Projets par défaut créés");
  }
}

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(async () => {
    console.log("✅ MongoDB connected");
    await bootstrapData();
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });