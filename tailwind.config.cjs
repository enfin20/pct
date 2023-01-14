module.exports = {
  mode: "jit",
  content: ["./src/**/*.svelte" /* ... */],
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
  theme: {
    extend: {
      colors: {
        pct: "rgb(0, 110, 118)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
