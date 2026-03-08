/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        mono:   ["Ubuntu Mono", "monospace"],
      },
      secondary: '#3b82f6', // Ex: '#3b82f6' pour un bleu
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["synthwave"],
    darkTheme: "synthwave",
    base: true,
    styled: true,
    utils: true,
  },
};
