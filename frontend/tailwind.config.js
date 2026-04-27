/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      colors: {
        "deep-space": "#050505",
        "neon-cyan": "#00f2fe",
        "neon-violet": "#4facfe",
        "neon-pink": "#ec4899",
      },
      animation: {
        "blob": "blob 7s infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "aurora": "aurora 15s ease infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        portfolio: {
          "primary": "#4facfe",
          "secondary": "#ec4899",
          "accent": "#00f2fe",
          "neutral": "#111116",
          "base-100": "#050505",
          "info": "#37cdf8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "dark",
    ],
    darkTheme: "portfolio",
    base: true,
    styled: true,
    utils: true,
  },
};
