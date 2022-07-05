const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        ...fontFamily.sans
      ],
      mono: [
        "Fira Mono",
        ...fontFamily.mono
      ]
    },
    extend: {
      colors: {
        link: {
          DEFAULT: "#009cdf",
          dark: "#0069ac"
        }
      }
    }
  },
  variants: {
    width: ["responsive", "hover", "focus"]
  },
  plugins: []
}
