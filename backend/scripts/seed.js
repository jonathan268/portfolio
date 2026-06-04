require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const BlogPost = require('../models/BlogPost');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.cm';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2024!';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI_LOCAL);
  console.log(' Connected to MongoDB');

  // ── Admin ──────────────────────────────────
  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!existing) {
    await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log(`Admin créé : ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log('  Admin déjà existant, ignoré');
  }

  // ── Categories ─────────────────────────────
  await Category.deleteMany({});
  await Category.insertMany([
    { name: 'SaaS', key: 'saas', order: 1, color: '#00b4d8' },
    { name: 'Web App', key: 'web', order: 2, color: '#48cae4' },
    { name: 'API', key: 'api', order: 3, color: '#0096c7' },
    { name: 'Desktop', key: 'desktop', order: 4, color: '#7b2d8e' },
    { name: 'Mobile', key: 'mobile', order: 5, color: '#e76f51' },
  ]);
  console.log(' Catégories insérées');

  // ── Skills ─────────────────────────────────
  await Skill.deleteMany({});
  await Skill.insertMany([
    {
      cat: 'Frontend',
      icon: '🖥',
      color: 'primary',
      items: ['React', 'Tailwind CSS', 'JavaScript'],
      order: 1,
    },
    {
      cat: 'Backend',
      icon: '⚙️',
      color: 'secondary',
      items: ['Node.js', 'Express', 'Laravel'],
      order: 2,
    },
    {
      cat: 'Database',
      icon: '🗄',
      color: 'accent',
      items: ['MongoDB', 'MySQL'],
      order: 3,
    },
    {
      cat: 'Tools',
      icon: '🛠',
      color: 'primary',
      items: ['Git', 'Docker', 'Postman'],
      order: 4,
    },
  ]);
  console.log('✅ Skills insérés');

  // ── Projects ───────────────────────────────
  await Project.deleteMany({});
  await Project.insertMany([
    {
      name: 'StockWise',
      tagline: 'AI Inventory Management SaaS',
      description:
        "Application SaaS permettant aux entreprises de gérer leurs stocks et d'analyser leurs données grâce à l'intelligence artificielle.",
      summary:
        "StockWise est une solution SaaS complète d'aide à la gestion des stocks et d'analyse prédictive. Grâce à l'intelligence artificielle, l'application permet aux entreprises de toute taille d'optimiser leurs niveaux de stock, de prévoir la demande et de réduire les ruptures. L'interface moderne et réactive offre une expérience utilisateur fluide, avec des tableaux de bord personnalisables et des alertes en temps réel.",
      features: [
        'Gestion produits & catégories',
        'Suivi des ventes en temps réel',
        'Dashboard analytics avancé',
        'Alertes de stock automatiques',
        'Analyse prédictive via IA',
      ],
      featureDetails: [
        {
          name: 'Gestion produits & catégories',
          description:
            'Interface complète de gestion des produits avec création, modification, suppression et organisation par catégories. Support des variantes, des prix multiples et des attributs personnalisés pour une flexibilité maximale.',
        },
        {
          name: 'Suivi des ventes en temps réel',
          description:
            'Tableau de bord dynamique affichant les ventes en direct avec des graphiques interactifs. Filtrage par période, catégorie, ou produit avec export des données en CSV/PDF.',
        },
        {
          name: 'Dashboard analytics avancé',
          description:
            "Analyses approfondies avec des métriques clés : chiffre d'affaires, marges, produits les plus vendus, tendances saisonnières. Visualisations customisables avec drag & drop.",
        },
        {
          name: 'Alertes de stock automatiques',
          description:
            'Système de notifications intelligentes pour les seuils de stock minimum, les ruptures imminentes et les réapprovisionnements suggérés. Notifications par email et in-app.',
        },
        {
          name: 'Analyse prédictive via IA',
          description:
            "Moteur d'IA intégré utilisant le machine learning pour prédire la demande future, recommander les quantités de réapprovisionnement optimales et identifier les tendances émergentes.",
        },
      ],
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini API'],
      type: 'saas',
      featured: true,
      live: '#',
      github: '#',
      order: 1,
      published: true,
    },
    {
      name: 'Flexify',
      tagline: 'Fitness & Workout Tracker',
      description:
        "Application web de suivi d'entraînements avec programmes personnalisés, statistiques de progression et suivi nutritionnel.",
      summary:
        "Flexify est une application complète de fitness qui permet aux utilisateurs de créer des programmes d'entraînement personnalisés, de suivre leurs performances et d'analyser leur progression. Avec une interface intuitive et des graphiques détaillés, l'application motive les utilisateurs à atteindre leurs objectifs sportifs.",
      features: [
        'Création de programmes',
        'Suivi des performances',
        'Statistiques et graphiques',
        'Suivi nutritionnel',
      ],
      featureDetails: [
        {
          name: 'Création de programmes',
          description:
            "Générateur de programmes d'entraînement personnalisés basés sur les objectifs, le niveau et les préférences de l'utilisateur. Bibliothèque d'exercices avec instructions vidéo et animations 3D.",
        },
        {
          name: 'Suivi des performances',
          description:
            "Enregistrement détaillé de chaque séance : poids soulevés, répétitions, temps, distance. Historique complet avec progression visible sur des graphiques d'évolution.",
        },
        {
          name: 'Statistiques et graphiques',
          description:
            "Visualisation avancée des données avec Chart.js : courbes de progression, heatmaps d'activité, répartition des groupes musculaires travaillés et comparaisons périodiques.",
        },
        {
          name: 'Suivi nutritionnel',
          description:
            'Journal alimentaire avec base de données de plus de 5000 aliments. Calcul automatique des macros, calories et micronutriments avec suggestions de repas personnalisées.',
        },
      ],
      stack: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
      type: 'web',
      featured: false,
      live: '#',
      github: '#',
      order: 2,
      published: true,
    },
    {
      name: 'Academix',
      tagline: 'School Management Platform',
      description:
        'Plateforme de gestion scolaire complète pour les établissements : élèves, notes, emplois du temps et communication.',
      summary:
        "Academix est une plateforme de gestion scolaire tout-en-un conçue pour les établissements d'enseignement. Elle centralise la gestion des élèves, des enseignants, des notes, des emplois du temps et de la communication interne. L'interface épurée et les workflows automatisés simplifient les tâches administratives quotidiennes.",
      features: [
        'Gestion élèves & enseignants',
        'Notes et bulletins automatisés',
        'Emplois du temps dynamiques',
        'Messagerie interne',
      ],
      featureDetails: [
        {
          name: 'Gestion élèves & enseignants',
          description:
            'Registre complet avec profils détaillés, historique scolaire, documents attachés et suivi des présences. Import/export en masse via fichiers CSV/Excel.',
        },
        {
          name: 'Notes et bulletins automatisés',
          description:
            'Saisie des notes par période avec calcul automatique des moyennes, classements et génération de bulletins personnalisables. Envoi automatique aux parents par email.',
        },
        {
          name: 'Emplois du temps dynamiques',
          description:
            "Planificateur visuel avec glisser-déposer pour créer les emplois du temps. Détection automatique des conflits de salle et d'horaire avec suggestions de résolution.",
        },
        {
          name: 'Messagerie interne',
          description:
            'Système de messagerie intégré entre enseignants, administration et parents. Notifications push et emails pour les communications importantes.',
        },
      ],
      stack: ['React', 'Laravel', 'MySQL', 'Tailwind'],
      type: 'web',
      featured: false,
      live: '#',
      github: '#',
      order: 3,
      published: true,
    },
    {
      name: 'E-Commerce API',
      tagline: 'RESTful API for Online Stores',
      description:
        'API REST complète pour boutiques e-commerce, avec auth JWT, gestion des commandes et paiement Mobile Money.',
      summary:
        "Une API REST robuste et sécurisée pour alimenter des boutiques e-commerce. Conçue avec une architecture modulaire, elle gère l'authentification JWT, les opérations CRUD complètes, l'intégration du paiement Mobile Money et une documentation Swagger interactive.",
      features: [
        'Auth JWT + refresh tokens',
        'CRUD produits, commandes, users',
        'Intégration Mobile Money',
        'Documentation Swagger',
      ],
      featureDetails: [
        {
          name: 'Auth JWT + refresh tokens',
          description:
            "Système d'authentification complet avec access tokens (15min) et refresh tokens (7 jours). Rate limiting, blacklisting et rotation automatique des tokens pour une sécurité maximale.",
        },
        {
          name: 'CRUD produits, commandes, users',
          description:
            'API RESTful complète avec pagination, filtrage et tri. Gestion des stocks, statuts de commande, rôles utilisateurs (admin, vendeur, client) et historique des modifications.',
        },
        {
          name: 'Intégration Mobile Money',
          description:
            'Support des principaux services Mobile Money africains (MTN Mobile Money, Orange Money, Airtel Money). Webhooks de confirmation de paiement et gestion des remboursements.',
        },
        {
          name: 'Documentation Swagger',
          description:
            "Documentation interactive complète avec Swagger/OpenAPI. Interface de test intégrée, schémas de données et exemples de requêtes pour faciliter l'intégration.",
        },
      ],
      stack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      type: 'api',
      featured: false,
      live: null,
      github: '#',
      order: 4,
      published: true,
    },
  ]);
  console.log('✅ Projets insérés');

  // ── Blog ───────────────────────────────────
  await BlogPost.deleteMany({});
  await BlogPost.insertMany([
    {
      title: "Construire un SaaS pour l'Afrique en 2024",
      excerpt:
        "Les défis et opportunités du marché tech africain : de l'intégration Mobile Money à l'architecture offline-first.",
      content: "# Introduction\n\nContenu de l'article à compléter...",
      tag: 'SaaS',
      readTime: '8 min',
      published: true,
    },
    {
      title: 'JWT + Refresh Tokens : la bonne architecture',
      excerpt:
        'Comment implémenter une authentification robuste et sécurisée avec Node.js et MongoDB.',
      content: "# Introduction\n\nContenu de l'article à compléter...",
      tag: 'Security',
      readTime: '6 min',
      published: true,
    },
    {
      title: 'MongoDB Aggregations : maîtriser le pipeline',
      excerpt:
        "Tutoriel complet sur les pipelines d'agrégation pour des analytics performants dans vos applications Node.js.",
      content: "# Introduction\n\nContenu de l'article à compléter...",
      tag: 'MongoDB',
      readTime: '10 min',
      published: true,
    },
  ]);
  console.log('✅ Articles insérés');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log(`   Admin : ${ADMIN_EMAIL}`);
  console.log(`   Mot de passe : ${ADMIN_PASSWORD}`);
  console.log('   ⚠️  Changez le mot de passe après la première connexion !\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
