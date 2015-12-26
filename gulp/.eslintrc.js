module.exports = {
  rules: {
    quotes: [2, 'single'],
    'linebreak-style': [2, 'unix'],
    semi: [2, 'always'],
    indent: [2, 2],
    'no-console': 0
  },
  globals: {
    describe: false,
    beforeEach: false,
    beforeAll: false,
    afterEach: false,
    afterAll: false,
    jasmine: false,
    spyOn: false,
    it: false,
    expect: false
  },
  env: {
    node: true
  },
  extends: 'eslint:recommended'
};
