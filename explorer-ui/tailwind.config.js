const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      mono: [
        "B612 Mono",
        ...fontFamily.mono
      ]
    }
  },
  variants: {
    width: ["responsive", "hover", "focus"]
  },
  plugins: []
}
