module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    fontFamily: {
      display: ['"IBM Plex Sans Condensed"', "sans-serif"],
      body: ['"IBM Plex Sans"', "sans-serif"],
    },
    extend: {},
    minHeight: {
      48: "12rem",
      60: "15rem",
      screen: "100vh",
    },
  },
  variants: {
    extend: {
      backgroundColor: ["even"],
    },
  },
  plugins: [],
};
