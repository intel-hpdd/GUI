import highland from 'highland';
import { formatBytes } from '@iml/number-formatters';
import { UsageInfoController } from '../../../../../source/iml/dashboard/usage-info/usage-info.js';
import angular from '../../../../angular-mock-setup.js';

describe('usage info', () => {
  let ctrl, $scope, stream, fs;

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      stream = highland();

      ctrl = {
        stream: stream,
        id: '1',
        prefix: 'bytes',
        format: '',
        generateStats: () => ({}),
        s2: undefined
      };

      UsageInfoController.bind(ctrl)($scope, propagateChange);
      jest.useFakeTimers();
    })
  );

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should format as bytes', () => {
    expect(ctrl.format).toBe(formatBytes);
  });

  it('should add a generateStats method', () => {
    expect(ctrl.generateStats).toEqual(expect.any(Function));
  });

  it('should set id on the controller', () => {
    expect(ctrl.id).toBe('1');
  });

  it('should set s2 on the controller', () => {
    expect(highland.isStream(ctrl.s2())).toBe(true);
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
        fs,
        {
          id: '2',
          bytes_free: 20000,
          bytes_total: 300000,
          filesfree: 40000,
          filestotal: 600000
        }
      ]);
    });

    it('should set data on the controller', () => {
      jest.runAllTimers();

      expect(ctrl.data).toEqual({
        id: '1',
        bytes_free: 10000,
        bytes_total: 100000,
        bytes_used: 90000,
        filesfree: 50000,
        filestotal: 500000
      });
    });

    it('should generate stats', () => {
      let results;

      ctrl.generateStats(ctrl.s2()).each(x => {
        results = x;
      });

      jest.runAllTimers();

      expect(results).toEqual([
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
