// @flow

import {
  noSpace
} from '../../../source/iml/string.js';

describe('string', () => {
  describe('no space', () => {
    it('should remove spaces from a template string', () => {
      expect(noSpace`foo d`)
        .toBe('food');
    });

    it('should work with vars', () => {
      const d = 'd';

      expect(noSpace`foo ${d}`)
        .toBe('food');
    });
  });
});
