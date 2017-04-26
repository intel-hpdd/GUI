// eslint-disable-next-line no-undef
module.exports = {
  expand: true,
  resetModules: true,
  clearMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test'],
  testMatch: ['**/*-test.js', '**/*.integration.js', '**/*.unit.js'],
  transformIgnorePatterns: ['/node_modules/(?!@mfl)/'],
  setupTestFrameworkScriptFile: './test/jest-matchers.js'
};
