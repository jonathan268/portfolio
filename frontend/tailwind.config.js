/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        mono:   ["Ubuntu Mono", "monospace"],
      },
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
