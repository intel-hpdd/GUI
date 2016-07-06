import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('server dashboard resolves', () => {
  var getReadWriteBandwidthChart, getCpuUsageChart,
    getMemoryUsageChart, $route, serverDashboardChartResolvesFactory;

  beforeEachAsync(async function () {
    getCpuUsageChart = jasmine.createSpy('getCpuUsageChart');

    const mod = await mock('source/iml/dashboard/server-dashboard-resolves.js', {});

    serverDashboardChartResolvesFactory = mod.serverDashboardChartResolvesFactory;
  });

  afterEach(resetAll);

  var $q, $rootScope, serverDashboardChartResolves;

  beforeEach(inject(function (_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;

    getReadWriteBandwidthChart = jasmine.createSpy('getReadWriteBandwidthChart');
    getMemoryUsageChart = jasmine.createSpy('getMemoryUsageChart');

    $route = {
      current: {
        params: {
          serverId: '1'
        }
      }
    };

    serverDashboardChartResolves = serverDashboardChartResolvesFactory(
      $route, $q, getReadWriteBandwidthChart, getMemoryUsageChart, getCpuUsageChart);
  }));

  it('should return a function', function () {
    expect(serverDashboardChartResolves).toEqual(jasmine.any(Function));
  });

  var res;

  beforeEach(function () {
    getReadWriteBandwidthChart.and.returnValue($q.when('read/write data'));
    getCpuUsageChart.and.returnValue($q.when('cpu usage data'));
    getMemoryUsageChart.and.returnValue($q.when('memory usage data'));

    res = serverDashboardChartResolves('1');
  });

  it('should setup the read write bandwidth chart', function () {
    expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({
      qs: {
        host_id: '1'
      }
    }, 'server1');
  });

  it('should setup the cpu usage chart', function () {
    expect(getCpuUsageChart).toHaveBeenCalledOnceWith({
      qs: {
        id: '1'
      }
    }, 'server1');
  });

  it('should setup the memory usage chart', function () {
    expect(getMemoryUsageChart).toHaveBeenCalledOnceWith({
      qs: {
        id: '1'
      }
    }, 'server1');
  });

  it('should be a promise', function () {
    expect(res).toBeAPromise();
  });

  it('should resolve with all the charts', function () {
    res.then(function (xs) {
      expect(xs).toEqual([
        'read/write data',
        'cpu usage data',
        'memory usage data'
      ]);
    });

    $rootScope.$apply();
  });
});
