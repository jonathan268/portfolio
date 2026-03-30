/**
 * TechIcon — affiche l'icône SVG d'une technologie via le CDN Devicon.
 * Fallback : badge stylisé si aucune icône trouvée.
 */

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

// name (normalisé) → [chemin devicon, couleur de fallback]
const ICON_MAP = {
  // ── Frontend ──────────────────────────────
  "react":          [`${DEVICON}/react/react-original.svg`,          "#61DAFB"],
  "next.js":        [`${DEVICON}/nextjs/nextjs-original.svg`,         "#ffffff"],
  "nextjs":         [`${DEVICON}/nextjs/nextjs-original.svg`,         "#ffffff"],
  "vue":            [`${DEVICON}/vuejs/vuejs-original.svg`,           "#4FC08D"],
  "vue.js":         [`${DEVICON}/vuejs/vuejs-original.svg`,           "#4FC08D"],
  "angular":        [`${DEVICON}/angularjs/angularjs-original.svg`,   "#DD0031"],
  "vite":           [`${DEVICON}/vitejs/vitejs-original.svg`,         "#646CFF"],
  "tailwind":       [`${DEVICON}/tailwindcss/tailwindcss-original.svg`, "#06B6D4"],
  "tailwindcss":    [`${DEVICON}/tailwindcss/tailwindcss-original.svg`, "#06B6D4"],
  "javascript":     [`${DEVICON}/javascript/javascript-original.svg`, "#F7DF1E"],
  "js":             [`${DEVICON}/javascript/javascript-original.svg`, "#F7DF1E"],
  "typescript":     [`${DEVICON}/typescript/typescript-original.svg`, "#3178C6"],
  "ts":             [`${DEVICON}/typescript/typescript-original.svg`, "#3178C6"],
  "html":           [`${DEVICON}/html5/html5-original.svg`,           "#E34F26"],
  "html5":          [`${DEVICON}/html5/html5-original.svg`,           "#E34F26"],
  "css":            [`${DEVICON}/css3/css3-original.svg`,             "#1572B6"],
  "css3":           [`${DEVICON}/css3/css3-original.svg`,             "#1572B6"],
  "svelte":         [`${DEVICON}/svelte/svelte-original.svg`,         "#FF3E00"],
  // ── Backend ───────────────────────────────
  "node.js":        [`${DEVICON}/nodejs/nodejs-original.svg`,         "#339933"],
  "nodejs":         [`${DEVICON}/nodejs/nodejs-original.svg`,         "#339933"],
  "node":           [`${DEVICON}/nodejs/nodejs-original.svg`,         "#339933"],
  "express":        [`${DEVICON}/express/express-original.svg`,       "#ffffff"],
  "express.js":     [`${DEVICON}/express/express-original.svg`,       "#ffffff"],
  "nestjs":         [`${DEVICON}/nestjs/nestjs-original.svg`,         "#E0234E"],
  "fastapi":        [`${DEVICON}/fastapi/fastapi-original.svg`,       "#009688"],
  "django":         [`${DEVICON}/django/django-plain.svg`,            "#092E20"],
  "laravel":        [`${DEVICON}/laravel/laravel-original.svg`,       "#FF2D20"],
  "php":            [`${DEVICON}/php/php-original.svg`,               "#777BB4"],
  "python":         [`${DEVICON}/python/python-original.svg`,         "#3776AB"],
  "ruby":           [`${DEVICON}/ruby/ruby-original.svg`,             "#CC342D"],
  "go":             [`${DEVICON}/go/go-original.svg`,                 "#00ADD8"],
  "rust":           [`${DEVICON}/rust/rust-original.svg`,             "#ffffff"],
  "java":           [`${DEVICON}/java/java-original.svg`,             "#ED8B00"],
  "kotlin":         [`${DEVICON}/kotlin/kotlin-original.svg`,         "#7F52FF"],
  "dotnet":         [`${DEVICON}/dotnetcore/dotnetcore-original.svg`, "#512BD4"],
  ".net":           [`${DEVICON}/dotnetcore/dotnetcore-original.svg`, "#512BD4"],
  // ── Databases ─────────────────────────────
  "mongodb":        [`${DEVICON}/mongodb/mongodb-original.svg`,       "#47A248"],
  "mongo":          [`${DEVICON}/mongodb/mongodb-original.svg`,       "#47A248"],
  "postgresql":     [`${DEVICON}/postgresql/postgresql-original.svg`, "#4169E1"],
  "postgres":       [`${DEVICON}/postgresql/postgresql-original.svg`, "#4169E1"],
  "mysql":          [`${DEVICON}/mysql/mysql-original.svg`,           "#4479A1"],
  "sqlite":         [`${DEVICON}/sqlite/sqlite-original.svg`,         "#003B57"],
  "redis":          [`${DEVICON}/redis/redis-original.svg`,           "#DC382D"],
  "firebase":       [`${DEVICON}/firebase/firebase-original.svg`,     "#FFCA28"],
  // ── Cloud / DevOps ────────────────────────
  "docker":         [`${DEVICON}/docker/docker-original.svg`,         "#2496ED"],
  "kubernetes":     [`${DEVICON}/kubernetes/kubernetes-original.svg`, "#326CE5"],
  "aws":            [`${DEVICON}/amazonwebservices/amazonwebservices-original.svg`, "#FF9900"],
  "gcp":            [`${DEVICON}/googlecloud/googlecloud-original.svg`, "#4285F4"],
  "azure":          [`${DEVICON}/azure/azure-original.svg`,           "#0089D6"],
  "nginx":          [`${DEVICON}/nginx/nginx-original.svg`,           "#009639"],
  "linux":          [`${DEVICON}/linux/linux-original.svg`,           "#FCC624"],
  "git":            [`${DEVICON}/git/git-original.svg`,               "#F05032"],
  "github":         [`${DEVICON}/github/github-original.svg`,         "#ffffff"],
  "gitlab":         [`${DEVICON}/gitlab/gitlab-original.svg`,         "#FC6D26"],
  // ── Tools ─────────────────────────────────
  "figma":          [`${DEVICON}/figma/figma-original.svg`,           "#F24E1E"],
  "graphql":        [`${DEVICON}/graphql/graphql-plain.svg`,          "#E10098"],
  "jest":           [`${DEVICON}/jest/jest-plain.svg`,                "#C21325"],
  "webpack":        [`${DEVICON}/webpack/webpack-original.svg`,       "#8DD6F9"],
  "babel":          [`${DEVICON}/babel/babel-original.svg`,           "#F9DC3E"],
  "electron":       [`${DEVICON}/electron/electron-original.svg`,     "#47848F"],
  "flutter":        [`${DEVICON}/flutter/flutter-original.svg`,       "#02569B"],
  "dart":           [`${DEVICON}/dart/dart-original.svg`,             "#0175C2"],
  "android":        [`${DEVICON}/android/android-original.svg`,       "#3DDC84"],
  "apple":          [`${DEVICON}/apple/apple-original.svg`,           "#ffffff"],
};

// Logos externes pour services sans devicon
const EXTERNAL_LOGOS = {
  "supabase":   ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/supabase.svg",   "#3ECF8E"],
  "stripe":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/stripe.svg",    "#635BFF"],
  "vercel":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vercel.svg",    "#ffffff"],
  "render":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/render.svg",    "#46E3B7"],
  "netlify":    ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/netlify.svg",   "#00C7B7"],
  "cloudinary": ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/cloudinary.svg","#3448C5"],
  "daisyui":    ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/daisyui.svg",   "#FF9903"],
  "prisma":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/prisma.svg",    "#2D3748"],
  "jwt":        ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/jsonwebtokens.svg", "#d63aff"],
  "pwa":        ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/pwa.svg",       "#5A0FC8"],
  "axios":      ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/axios.svg",     "#5A29E4"],
  "gemini":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlegemini.svg", "#8E75B2"],
  "openai":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg",    "#ffffff"],
  "claude":     ["https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/anthropic.svg", "#d4a27f"],
};

function normalize(name) {
  return name.toLowerCase().trim();
}

/**
 * @param {string} name  - nom de la techno tel qu'entré dans le dashboard
 * @param {number} size  - taille en px (default 20)
 * @param {string} accentColor - couleur de l'anneau/fond (couleur du projet)
 */
export default function TechIcon({ name, size = 20, accentColor }) {
  const key = normalize(name);
  const entry = ICON_MAP[key] || EXTERNAL_LOGOS[key];

  if (entry) {
    const [src, color] = entry;
    return (
      <div
        title={name}
        className="flex items-center justify-center transition-transform duration-200 rounded-md shrink-0 hover:scale-110"
        style={{
          width:  size + 10,
          height: size + 10,
          background: `${color}14`,
          border: `1px solid ${color}28`,
        }}
      >
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          style={{
            filter: (key === "express" || key === "express.js" || key === "nextjs" || key === "next.js" || key === "github" || key === "rust" || key === "vercel" || key === "apple")
              ? "brightness(0) invert(1) opacity(0.85)"
              : undefined,
            display: "block",
          }}
          onError={e => { e.currentTarget.parentElement.innerHTML = fallbackHTML(name, accentColor); }}
        />
      </div>
    );
  }

  // Fallback : badge texte stylisé
  return <FallbackBadge name={name} accentColor={accentColor} />;
}

function FallbackBadge({ name, accentColor }) {
  const color = accentColor || "#e779c1";
  return (
    <div
      title={name}
      className="flex items-center justify-center rounded-md shrink-0 px-1.5"
      style={{
        height: 30,
        minWidth: 30,
        background: `${color}14`,
        border: `1px solid ${color}28`,
      }}
    >
      <span className="font-mono text-[9px] tracking-wide" style={{ color }}>
        {name.length > 6 ? name.slice(0, 5) + "…" : name}
      </span>
    </div>
  );
}

function fallbackHTML(name, accentColor) {
  const color = accentColor || "#e779c1";
  return `<span style="font-family:monospace;font-size:9px;color:${color};padding:0 4px">${name.slice(0,5)}</span>`;
}