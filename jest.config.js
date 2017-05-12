module.exports = {
  resetModules: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test'],
  testMatch: ['**/*-test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@mfl)/'],
  setupTestFrameworkScriptFile: './test/n-matchers.js'
};
