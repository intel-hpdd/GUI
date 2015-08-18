describe('Format bytes', function () {
  'use strict';

  var tests, formatBytes;

  beforeEach(module('numberFormatters'));

  beforeEach(inject(function (_formatBytes_) {
    formatBytes = _formatBytes_;

    tests = [
      {
        in: [320, 3],
        out: '320 B'
      },
      {
        in: [200000],
        out: '195.3 kB'
      },
      {
        in: [3124352],
        out: '2.980 MB'
      },
      {
        in: [432303020202, 6],
        out: '402.614 GB'
      },
      {
        in: [5323330102372, 3],
        out: '4.84 TB'
      },
      {
        in: ['5323330102372', '3'],
        out: '4.84 TB'
      },
      {
        in: [1000],
        out: '1000 B'
      },
      {
        in: [1000, 0],
        out: '1000 B'
      },
      {
        in: [1024, 0],
        out: '1.000 kB'
      },
      {
        in: [4326, 5],
        out: '4.2246 kB'
      },
      {
        in: [3045827469],
        out: '2.837 GB'
      },
      {
        in: [84567942345572238],
        out: '75.11 PB'
      },
      {
        in: [5213456204567832146028],
        out: '4.416 ZB'
      },
      {
        in: [NaN],
        out: ''
      },
      {
        in: ['quack'],
        out: ''
      }
    ];
  }));

  it('should determine the best size and suffix to display', function () {
    tests.forEach(function (test) {
      expect(formatBytes.apply(null, test.in)).toEqual(test.out);
    });
  });
});
