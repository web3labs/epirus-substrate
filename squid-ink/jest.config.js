/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/.jest/setEnv.js"],
  moduleNameMapper: {
    '^@chain/(.*)$': '<rootDir>/src/chains/local/$1',
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/model/",
    "<rootDir>/lib/model/",
    "<rootDir>/src/chains/local/types",
    "<rootDir>/lib/chains/local/types"
  ],
};