import lnetModule from '../../../../source/iml/lnet/lnet-module';

describe('lnet options', function() {
  let LNET_OPTIONS;

  const expectedValues = Array.from(Array(11), (x, idx) => idx - 1).map(
    value =>
      value === -1
        ? { name: 'Not Lustre Network', value }
        : { name: `Lustre Network ${value}`, value }
  );

  beforeEach(module(lnetModule));

  beforeEach(
    inject(function(_LNET_OPTIONS_) {
      LNET_OPTIONS = _LNET_OPTIONS_;
    })
  );

  describe('enum', () => {
    expectedValues.forEach((expectedValue, index) => {
      it(`should have a value for ${expectedValue.name}.`, () => {
        expect(LNET_OPTIONS[index]).toEqual(expectedValue);
      });
    });
  });
});
