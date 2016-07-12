import highland from 'highland';
import dashboardModule from '../../../../../source/iml/dashboard/dashboard-module.js';
import formatBytes from '../../../../../source/iml/number-formatters/format-bytes.js';


describe('usage info', () => {
  let ctrl, $scope,
    $exceptionHandler, stream, fs;

  beforeEach(module(dashboardModule));

  beforeEach(inject(($controller, $rootScope) => {
    $scope = $rootScope.$new();

    $exceptionHandler = jasmine.createSpy('$exceptionHandler');

    stream = highland();

    ctrl = $controller('UsageInfoController', {
      $scope,
      $exceptionHandler
    }, {
      stream,
      id: '1',
      prefix: 'bytes'
    });

    jasmine.clock().install();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should format as bytes', () => {
    expect(ctrl.format)
      .toBe(formatBytes);
  });

  it('should add a generateStats method', () => {
    expect(ctrl.generateStats)
      .toEqual(jasmine.any(Function));
  });

  it('should set id on the controller', () => {
    expect(ctrl.id)
      .toBe('1');
  });

  it('should set s2 on the controller', () => {
    expect(highland.isStream(ctrl.s2()))
      .toBe(true);
  });

  describe('with id', () => {
    beforeEach(() => {
      fs = {
        id: '1',
        bytes_free: 10000,
        bytes_total: 100000,
        filesfree: 50000,
        filestotal: 500000
      };

      stream.write([
        fs, {
          id: '2',
          bytes_free: 20000,
          bytes_total: 300000,
          filesfree: 40000,
          filestotal: 600000
        }]);
    });

    it('should set data on the controller', () => {
      jasmine.clock().tick();

      expect(ctrl.data)
        .toEqual({
          id: '1',
          bytes_free: 10000,
          bytes_total: 100000,
          bytes_used: 90000,
          filesfree: 50000,
          filestotal: 500000
        });
    });

    it('should generate stats', () => {
      var results;

      ctrl.generateStats(ctrl.s2())
        .each(function (x) {
          results = x;
        });

      jasmine.clock().tick();

      expect(results)
        .toEqual([
          [
            {
              key: 'Free',
              y: 10000
            },
            {
              key: 'Used',
              y: 90000
            }
          ]
        ]);
    });
  });
});
