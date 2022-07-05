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
        dunes: "url('https://images.unsplash.com/photo-1654521957182-f0277b65005a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80')"
      })
    }
  },
  variants: {
    width: ["responsive", "hover", "focus"]
  },
  plugins: []
}
