require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const BlogPost = require("../models/BlogPost");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portfolio.cm";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2024!";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI_LOCAL);
  console.log("✅ Connected to MongoDB");

  // ── Admin ──────────────────────────────────
  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!existing) {
    await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log(`✅ Admin créé : ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log("ℹ️  Admin déjà existant, ignoré");
  }

  // ── Skills ─────────────────────────────────
  await Skill.deleteMany({});
  await Skill.insertMany([
    { cat:"Frontend", icon:"🖥",  color:"primary",   items:["React","Tailwind CSS","JavaScript"], order:1 },
    { cat:"Backend",  icon:"⚙️", color:"secondary",  items:["Node.js","Express","Laravel"],       order:2 },
    { cat:"Database", icon:"🗄",  color:"accent",     items:["MongoDB","MySQL"],                   order:3 },
    { cat:"Tools",    icon:"🛠",  color:"primary",    items:["Git","Docker","Postman"],             order:4 },
  ]);
  console.log("✅ Skills insérés");

  // ── Projects ───────────────────────────────
  await Project.deleteMany({});
  await Project.insertMany([
    {
      name:"StockWise", tagline:"AI Inventory Management SaaS",
      description:"Application SaaS permettant aux entreprises de gérer leurs stocks et d'analyser leurs données grâce à l'intelligence artificielle.",
      features:["Gestion produits & catégories","Suivi des ventes en temps réel","Dashboard analytics avancé","Alertes de stock automatiques","Analyse prédictive via IA"],
      stack:["React","Node.js","Express","MongoDB","Gemini API"],
      type:"saas", featured:true, live:"#", github:"#", order:1, published:true,
    },
    {
      name:"Flexify", tagline:"Fitness & Workout Tracker",
      description:"Application web de suivi d'entraînements avec programmes personnalisés, statistiques de progression et suivi nutritionnel.",
      features:["Création de programmes","Suivi des performances","Statistiques et graphiques","Suivi nutritionnel"],
      stack:["React","Node.js","MongoDB","Chart.js"],
      type:"web", featured:false, live:"#", github:"#", order:2, published:true,
    },
    {
      name:"Academix", tagline:"School Management Platform",
      description:"Plateforme de gestion scolaire complète pour les établissements : élèves, notes, emplois du temps et communication.",
      features:["Gestion élèves & enseignants","Notes et bulletins automatisés","Emplois du temps dynamiques","Messagerie interne"],
      stack:["React","Laravel","MySQL","Tailwind"],
      type:"web", featured:false, live:"#", github:"#", order:3, published:true,
    },
    {
      name:"E-Commerce API", tagline:"RESTful API for Online Stores",
      description:"API REST complète pour boutiques e-commerce, avec auth JWT, gestion des commandes et paiement Mobile Money.",
      features:["Auth JWT + refresh tokens","CRUD produits, commandes, users","Intégration Mobile Money","Documentation Swagger"],
      stack:["Node.js","Express","MongoDB","JWT"],
      type:"api", featured:false, live:null, github:"#", order:4, published:true,
    },
  ]);
  console.log("✅ Projets insérés");

  // ── Blog ───────────────────────────────────
  await BlogPost.deleteMany({});
  await BlogPost.insertMany([
    {
      title:"Construire un SaaS pour l'Afrique en 2024",
      excerpt:"Les défis et opportunités du marché tech africain : de l'intégration Mobile Money à l'architecture offline-first.",
      content:"# Introduction\n\nContenu de l'article à compléter...",
      tag:"SaaS", readTime:"8 min", published:true,
    },
    {
      title:"JWT + Refresh Tokens : la bonne architecture",
      excerpt:"Comment implémenter une authentification robuste et sécurisée avec Node.js et MongoDB.",
      content:"# Introduction\n\nContenu de l'article à compléter...",
      tag:"Security", readTime:"6 min", published:true,
    },
    {
      title:"MongoDB Aggregations : maîtriser le pipeline",
      excerpt:"Tutoriel complet sur les pipelines d'agrégation pour des analytics performants dans vos applications Node.js.",
      content:"# Introduction\n\nContenu de l'article à compléter...",
      tag:"MongoDB", readTime:"10 min", published:true,
    },
  ]);
  console.log("✅ Articles insérés");

  console.log("\n🎉 Seed terminé avec succès !");
  console.log(`   Admin : ${ADMIN_EMAIL}`);
  console.log(`   Mot de passe : ${ADMIN_PASSWORD}`);
  console.log("   ⚠️  Changez le mot de passe après la première connexion !\n");

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
