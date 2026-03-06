# Portfolio — Jonathan
> Fullstack portfolio avec dashboard admin caché · React + Node.js + MongoDB

---

## Structure du projet

```
portfolio/
├── backend/          → Node.js + Express + MongoDB
└── frontend/         → React + Vite + Tailwind + DaisyUI
```

---

## 1. Développement local

### Prérequis
- Node.js 18+
- Compte MongoDB Atlas (gratuit)
- Git

---

### Backend

```bash
cd backend
cp .env.example .env
# Remplissez le .env avec vos valeurs
npm install
npm run seed        # Crée l'admin + données de départ
npm run dev         # Démarre sur http://localhost:5000
```

Variables `.env` à configurer :
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=une_chaine_aleatoire_longue_minimum_32_caracteres
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

### Frontend

```bash
cd frontend
cp .env.example .env
# En local le proxy Vite gère /api → pas besoin de VITE_API_URL
npm install
npm run dev         # Démarre sur http://localhost:5173
```

**Accès admin local :** `http://localhost:5173/admin`
- Email : `admin@portfolio.cm`
- Mot de passe : `Admin@2024!`

⚠️ **Changez le mot de passe** en base après la première connexion !

---

## 2. Déploiement en production

### Étape 1 — MongoDB Atlas

1. Allez sur [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Créez un cluster **gratuit** (M0)
3. Créez un utilisateur base de données (Database Access)
4. Autorisez toutes les IPs : `0.0.0.0/0` (Network Access)
5. Copiez la **connection string** :
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio
   ```

---

### Étape 2 — Déployer le backend sur Render

1. Allez sur [render.com](https://render.com) → **New Web Service**
2. Connectez votre repo GitHub
3. Configurez :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Node version** : 18
4. Ajoutez les variables d'environnement :
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=votre_secret_long
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://votre-portfolio.vercel.app
   PORT=5000
   ```
5. Déployez. Notez l'URL : `https://portfolio-backend-xxxx.onrender.com`

6. **Seed la base de données** (une seule fois) :
   - Sur Render → Shell → `npm run seed`
   - Ou en local avec le bon MONGODB_URI dans `.env`

---

### Étape 3 — Déployer le frontend sur Vercel

1. Allez sur [vercel.com](https://vercel.com) → **New Project**
2. Importez votre repo GitHub
3. Configurez :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Ajoutez la variable d'environnement :
   ```
   VITE_API_URL=https://portfolio-backend-xxxx.onrender.com/api
   ```
5. Déployez. Votre portfolio est en ligne !

---

### Étape 4 — Vérifications finales

- [ ] Portfolio accessible sur votre URL Vercel
- [ ] Les projets / skills / blog s'affichent (données du seed)
- [ ] `https://votre-url.vercel.app/admin` → page de login
- [ ] Connexion admin fonctionne
- [ ] Créer un projet depuis le dashboard → visible sur le portfolio
- [ ] Formulaire contact → message visible dans l'admin
- [ ] Mettre à jour `CLIENT_URL` sur Render avec l'URL Vercel exacte

---

### Étape 5 — Domaine personnalisé (optionnel)

**Vercel :**
1. Settings → Domains → Add Domain
2. Ajoutez votre domaine (ex: `jonathan.dev`)
3. Configurez les DNS chez votre registrar :
   ```
   CNAME  www   cname.vercel-dns.com
   A      @     76.76.19.19
   ```

**Render :**
1. Settings → Custom Domains
2. Ajoutez `api.jonathan.dev`
3. Mettez à jour `VITE_API_URL` sur Vercel et `CLIENT_URL` sur Render

---

## 3. Routes API

| Méthode | Route                     | Auth | Description                  |
|---------|---------------------------|------|------------------------------|
| GET     | /api/projects             | —    | Projets publiés               |
| GET     | /api/projects/admin/all   | ✅   | Tous les projets (admin)      |
| POST    | /api/projects             | ✅   | Créer un projet               |
| PUT     | /api/projects/:id         | ✅   | Modifier un projet            |
| DELETE  | /api/projects/:id         | ✅   | Supprimer un projet           |
| GET     | /api/blog                 | —    | Articles publiés              |
| GET     | /api/blog/:slug           | —    | Article par slug              |
| GET     | /api/blog/admin/all       | ✅   | Tous les articles (admin)     |
| POST    | /api/blog                 | ✅   | Créer un article              |
| PUT     | /api/blog/:id             | ✅   | Modifier un article           |
| DELETE  | /api/blog/:id             | ✅   | Supprimer un article          |
| GET     | /api/skills               | —    | Toutes les catégories skills  |
| POST    | /api/skills               | ✅   | Créer une catégorie           |
| PUT     | /api/skills/:id           | ✅   | Modifier une catégorie        |
| DELETE  | /api/skills/:id           | ✅   | Supprimer une catégorie       |
| POST    | /api/messages             | —    | Envoyer un message (contact)  |
| GET     | /api/messages             | ✅   | Lire les messages (admin)     |
| PATCH   | /api/messages/:id/read    | ✅   | Marquer comme lu              |
| DELETE  | /api/messages/:id         | ✅   | Supprimer un message          |
| POST    | /api/auth/login           | —    | Connexion admin               |
| GET     | /api/auth/me              | ✅   | Vérifier le token             |

---

## 4. Stack technique

| Couche    | Technologies                              |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, DaisyUI, React Router v6, Axios |
| Backend   | Node.js, Express, Mongoose, JWT, bcryptjs |
| Base de données | MongoDB Atlas                        |
| Déploiement | Vercel (frontend) + Render (backend)   |

---

## 5. Commandes utiles

```bash
# Backend dev
cd backend && npm run dev

# Backend seed (reset + données initiales)
cd backend && npm run seed

# Frontend dev
cd frontend && npm run dev

# Frontend build
cd frontend && npm run build
```

---

**Accès admin :** `/admin` — route cachée, non linkée sur le portfolio public.
