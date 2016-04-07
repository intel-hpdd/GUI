import highland from 'highland';
import targetDashboardModule
  from '../../../../source/iml/dashboard/target-dashboard-module';


describe('Target dashboard', () => {
  var $route, socketStream, s, getStore, spy;

  beforeEach(module(targetDashboardModule, function ($provide) {
    spy = jasmine.createSpy('spy');
    $route = {
      current: {
        params: {},
        $$route: {}
      }
    };

    $provide.value('$route', $route);

    s = highland();
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);
    $provide.value('socketStream', socketStream);

    getStore = {
      select: jasmine.createSpy('select').and.returnValue(s)
    };
    $provide.value('getStore', getStore);
  }));

  describe('kind', function () {
    var targetDashboardKind;

    beforeEach(inject(function (_targetDashboardKind_) {
      targetDashboardKind = _targetDashboardKind_;
    }));

    it('should return the target kind', function () {
      $route.current.$$route.kind = 'MDT';

      expect(targetDashboardKind()).toBe('MDT');
    });
  });

  describe('chart resolves', function () {
    var getFileUsageChart, getSpaceUsageChart,
      getMdoChart, getReadWriteBandwidthChart;

    beforeEach(module(function ($provide) {
      getFileUsageChart = jasmine.createSpy('getFileUsageChart')
        .and.returnValue('fileUsageChart');
      $provide.value('getFileUsageChart', getFileUsageChart);

      getSpaceUsageChart = jasmine.createSpy('getSpaceUsageChart')
        .and.returnValue('spaceUsageChart');
      $provide.value('getSpaceUsageChart', getSpaceUsageChart);

      getMdoChart = jasmine.createSpy('getMdoChart')
        .and.returnValue('mdoChart');
      $provide.value('getMdoChart', getMdoChart);

      getReadWriteBandwidthChart = jasmine.createSpy('getReadWriteBandwidthChart')
        .and.returnValue('readWriteBandwidthChart');
      $provide.value('getReadWriteBandwidthChart', getReadWriteBandwidthChart);
    }));

    var $rootScope, targetDashboardResolves;

    beforeEach(inject(function (_$rootScope_, _targetDashboardResolves_) {
      $rootScope = _$rootScope_;
      targetDashboardResolves = _targetDashboardResolves_;
    }));

    it('should return a function', function () {
      expect(targetDashboardResolves).toEqual(jasmine.any(Function));
    });

    describe('MDT', function () {
      var promise;

      beforeEach(function () {
        $route.current.params.targetId = '1';
        $route.current.$$route.kind = 'MDT';

        promise = targetDashboardResolves();
      });

      it('should call mdoChart', function () {
        $rootScope.$apply();

        expect(getMdoChart).toHaveBeenCalledOnceWith({
          qs: {
            id: '1'
          }
        });
      });

      it('should call fileUsageChart', function () {
        $rootScope.$apply();

        expect(getFileUsageChart).toHaveBeenCalledOnceWith(
          'File Usage',
          'Files Used',
          {
            qs: {
              id: '1'
            }
          }
        );
      });

      it('should call spaceUsageChart', function () {
        $rootScope.$apply();

        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith({
          qs: {
            id: '1'
          }
        });
      });

      it('should return MDT charts', function () {
        var result;

        promise
          .then(function (x) {
            result = x;
          });

        $rootScope.$apply();

        expect(result).toEqual([
          'mdoChart',
          'fileUsageChart',
          'spaceUsageChart'
        ]);
      });
    });

    describe('OST', function () {
      beforeEach(function () {
        $route.current.params.targetId = '1';
        $route.current.$$route.kind = 'OST';

        targetDashboardResolves();
      });

      it('should call readWriteBandwidthChart', function () {
        $rootScope.$apply();

        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({
          qs: {
            id: '1'
          }
        });
      });

      it('should call fileUsageChart', function () {
        $rootScope.$apply();

        expect(getFileUsageChart).toHaveBeenCalledOnceWith(
          'Object Usage',
          'Objects Used',
          {
            qs: {
              id: '1'
            }
          }
        );
      });

      it('should call spaceUsageChart', function () {
        $rootScope.$apply();

        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith({
          qs: {
            id: '1'
          }
        });
      });
    });
  });

  describe('target stream', function () {
    var $rootScope, targetDashboardTargetStream, targetStream;

    beforeEach(inject(function (_$rootScope_, _targetDashboardTargetStream_) {
      $rootScope = _$rootScope_;

      $route.current.params.targetId = '1';

      targetDashboardTargetStream = _targetDashboardTargetStream_;

      targetStream = targetDashboardTargetStream();
    }));

    it('should be a function', function () {
      expect(targetDashboardTargetStream).toEqual(jasmine.any(Function));
    });

    it('should call socketStream', function () {
      expect(getStore.select).toHaveBeenCalledOnceWith('targets');
    });

    it('should stream data', function () {
      targetStream.each(spy);
      s.write([
        {
          id: '5',
          name: 'target5'
        }, {
          id: '1',
          name: 'target1'
        }
      ]);
      $rootScope.$apply();

      expect(spy).toHaveBeenCalledOnceWith({
        id: '1',
        name: 'target1'
      });
    });
  });

  describe('usage stream', function () {
    var $rootScope, targetDashboardUsageStream, promise;

    beforeEach(inject(function (_$rootScope_, _targetDashboardUsageStream_) {
      $rootScope = _$rootScope_;
      targetDashboardUsageStream = _targetDashboardUsageStream_;

      $route.current.params.targetId = '1';

      promise = targetDashboardUsageStream();
    }));

    it('should call socketStream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith(
        '/target/1/metric/',
        {
          qs: {
            metrics: 'filestotal,filesfree,kbytestotal,kbytesfree',
            latest: true
          }
        }
      );
    });

    it('should stream data', function () {
      var result;

      promise.then(function (s) {
        s.each(function (x) {
          result = x;
        });
      });

      s.write([{
        data: {
          kbytesfree: 1000,
          kbytestotal: 2000
        }
      }]);
      $rootScope.$apply();

      expect(result).toEqual({
        kbytesfree: 1000,
        kbytestotal: 2000,
        bytes_free: 1024000,
        bytes_total: 2048000
      });
    });
  });
});
