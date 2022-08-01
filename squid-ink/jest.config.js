/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/.jest/setEnv.js"],
  moduleNameMapper: {
    "^@chain/(.*)$": "<rootDir>/src/chains/local/$1",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  coveragePathIgnorePatterns: [
    "<rootDir>/src/model/",
    "<rootDir>/src/chains/local/types",
  ],
};