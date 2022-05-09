module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Mont", "Montserrat", "Roboto"],
    },
    extend: {
      colors: {
        arbPurple: {
          DEFAULT: "#0466C8",
          secondary: "#B436EB",
          menuBg: "#272224",
          mainBg: "#090920",
          tLight: "#CCE3FA",
          tLight2: "#07071D",
          tDark1: "#720FA4",
          tDark2: "#611388",
          tDark3: "#541375",
          tDark4: "#501270",
          tDark5: "#320E4B",
          tDark6: "#070715",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
