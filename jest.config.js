const process = require("process");

process.env.NODE_ENV = "production";

// eslint-disable-next-line no-undef
module.exports = {
  verbose: false,
  resetModules: true,
  clearMocks: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/test"],
  testMatch: ["**/*-test.js", "**/*.integration.js", "**/*.unit.js"],
  transformIgnorePatterns: ["/node_modules/(?!@iml)/*"],
  setupFilesAfterEnv: ["./test/jest-matchers.js"]
};
