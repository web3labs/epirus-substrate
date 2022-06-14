const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      mono: [
        "Fira Mono",
        ...fontFamily.mono
      ]
    }
  },
  variants: {
    width: ["responsive", "hover", "focus"]
  },
  plugins: []
}
