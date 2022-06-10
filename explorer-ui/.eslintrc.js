module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  globals: {
    JSX: true
  },
  extends: [
    "plugin:react/recommended",
    "standard"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    "jsx-quotes": ["error", "prefer-double"],
    indent: ["error", 2]
  }
}
