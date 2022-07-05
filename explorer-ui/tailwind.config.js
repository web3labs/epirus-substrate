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
      backgroundImage: (theme) => ({
        dunes1: "url('https://images.unsplash.com/photo-1521208916306-71fce562015a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80')",
        dunes: "url('https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')"
      }),
      opacity: {
        85: ".85"
      }
    }
  },
  variants: {
    width: ["responsive", "hover", "focus", "focus-within"]
  },
  plugins: []
}
