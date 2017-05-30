import lnetOptions from '../../../../source/iml/lnet/lnet-options.js';

const expectedValues = [
  { name: 'Not Lustre Network', value: -1 },
  { name: 'Lustre Network 0', value: 0 },
  { name: 'Lustre Network 1', value: 1 },
  { name: 'Lustre Network 2', value: 2 },
  { name: 'Lustre Network 3', value: 3 },
  { name: 'Lustre Network 4', value: 4 },
  { name: 'Lustre Network 5', value: 5 },
  { name: 'Lustre Network 6', value: 6 },
  { name: 'Lustre Network 7', value: 7 },
  { name: 'Lustre Network 8', value: 8 },
  { name: 'Lustre Network 9', value: 9 }
];

describe('lnet options', function() {
  describe('enum', () => {
    expectedValues.forEach((expectedValue, index) => {
      it(`should have a value for ${expectedValue.name}.`, () => {
        expect(lnetOptions[index]).toEqual(expectedValue);
      });
    });
  });
});
