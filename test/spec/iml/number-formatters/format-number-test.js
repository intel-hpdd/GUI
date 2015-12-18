describe('Format number', function () {
  'use strict';

  var formatNumber, $window;
  var tests = [
    // non 0 numbers
    {
      in: [22, 10],
      out: '22',
      outStrict: '22.00000000'
    },
    {
      in: [22.3, 10],
      out: '22.3',
      outStrict: '22.30000000'
    },
    {
      in: [22.3, 2],
      out: '22',
      outStrict: '22'
    },
    {
      in: [22.3, 1],
      out: '20',
      outStrict: '20'
    },
    // Zeroes placed before other digits are not significant
    {
      in: [0.023, 5],
      out: '0.023',
      outStrict: '0.023000'
    },
    {
      in: [0.023, 1],
      out: '0.02',
      outStrict: '0.02'
    },
    // Zeroes placed between other digits are always significant
    {
      in: [8007, 5],
      out: '8.007k',
      outStrict: '8.0070k'
    },
    {
      in: [8007, 3],
      out: '8.01k',
      outStrict: '8.01k'
    },
    {
      in: [8007, 2],
      out: '8k',
      outStrict: '8.0k'
    },
    {
      in: [8007000, 5],
      out: '8.007M',
      outStrict: '8.0070M'
    },
    {
      in: [800700, 5],
      out: '800.7k',
      outStrict: '800.70k'
    },
    {
      in: [80070, 5],
      out: '80.07k',
      outStrict: '80.070k'
    },
    // Zeroes at the end of a number are significant only if they are behind a decimal point. Otherwise, it is
    // impossible to tell if they are significant
    {
      in: [8200, 5],
      out: '8.2k',
      outStrict: '8.2000k'
    },
    {
      in: [8200, 3],
      out: '8.2k',
      outStrict: '8.20k'
    },
    {
      in: [8200, 2],
      out: '8.2k',
      outStrict: '8.2k'
    },
    {
      in: [8200, 1],
      out: '8k',
      outStrict: '8k'
    }
  ];

  beforeEach(window.module('numberFormatters'));

  beforeEach(inject(function (_formatNumber_) {
    formatNumber = _formatNumber_;
  }));

  describe('with Intl.NumberFormat polyfill', function () {

    beforeEach(inject(function (_$window_) {
      $window = _$window_;
      $window.Intl = null;
    }));

    describe('standard mode', function () {
      tests.forEach(function (test) {
        it('should format %s with %s significant digits to %s'.sprintf(test.in[0], test.in[1], test.out), function () {
          expect(formatNumber.apply(null, test.in)).toEqual(test.out);
        });
      });
    });

    describe('strict mode', function () {
      tests.forEach(function (test) {
        it('should format %s with %s significant digits to %s'.sprintf(test.in[0], test.in[1], test.out), function () {
          expect(formatNumber.apply(null, test.in.concat(true))).toEqual(test.outStrict);
        });
      });
    });
  });

  describe('without polyfill', function () {
    describe('standard mode', function () {
      tests.forEach(function (test) {
        it('should format %s with %s significant digits to %s'.sprintf(test.in[0], test.in[1], test.out), function () {
          expect(formatNumber.apply(null, test.in)).toEqual(test.out);
        });
      });
    });

    describe('strict mode', function () {
      tests.forEach(function (test) {
        it('should format %s with %s significant digits to %s'.sprintf(test.in[0], test.in[1], test.out), function () {
          expect(formatNumber.apply(null, test.in.concat(true))).toEqual(test.outStrict);
        });
      });
    });
  });
});
