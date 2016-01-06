module.exports = {
  parser: 'babel-eslint',
  rules: {
    quotes: [2, 'single'],
    'linebreak-style': [2, 'unix'],
    semi: [2, 'always'],
    indent: [2, 2],
    'no-func-assign': 0,
    'no-constant-condition': 0,
    'no-multiple-empty-lines': [2, {max: 2, maxEOF: 1}],
    curly: [2, 'multi', 'consistent'],
    'eol-last': [2, 'unix']
  },
  globals: {
    math: false,
    _: false,
    highland: false,
    jasmine: false,
    expectToEqual: false,
    expectStreamToContainItem: false,
    nil: false,
    spyOn: false,
    it: false,
    console: false,
    describe: false,
    expect: false,
    beforeEach: false,
    afterEach: false,
    waits: false,
    waitsFor: false,
    runs: false,
    convertNvDates: false,
    patchRateLimit: false,
    moment: false
  },
  ecmaFeatures: {
    modules: true
  },
  env: {
    es6: true,
    browser: true
  },
  extends: 'eslint:recommended'
};
