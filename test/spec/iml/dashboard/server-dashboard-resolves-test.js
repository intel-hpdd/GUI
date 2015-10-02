describe('server dashboard resolves', function () {
  'use strict';

  var getReadWriteBandwidthChart, getCpuUsageChart,
    getMemoryUsageChart, $route;

  beforeEach(module('serverDashboard', function ($provide) {
    getReadWriteBandwidthChart = jasmine.createSpy('getReadWriteBandwidthChart');
    $provide.value('getReadWriteBandwidthChart', getReadWriteBandwidthChart);

    getCpuUsageChart = jasmine.createSpy('getCpuUsageChart');
    $provide.value('getCpuUsageChart', getCpuUsageChart);

    getMemoryUsageChart = jasmine.createSpy('getMemoryUsageChart');
    $provide.value('getMemoryUsageChart', getMemoryUsageChart);

    $route = {
      current: {
        params: {
          serverId: '1'
        }
      }
    };
    $provide.value('$route', $route);
  }));

  var $q, $rootScope, serverDashboardChartResolves;

  beforeEach(inject(function (_$q_, _$rootScope_, _serverDashboardChartResolves_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    serverDashboardChartResolves = _serverDashboardChartResolves_;
  }));

  it('should return a function', function () {
    expect(serverDashboardChartResolves).toEqual(jasmine.any(Function));
  });

  var res;

  beforeEach(function () {
    getReadWriteBandwidthChart.andReturn($q.when('read/write data'));
    getCpuUsageChart.andReturn($q.when('cpu usage data'));
    getMemoryUsageChart.andReturn($q.when('memory usage data'));

    res = serverDashboardChartResolves('1');
  });

  it('should setup the read write bandwidth chart', function () {
    expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should setup the cpu usage chart', function () {
    expect(getCpuUsageChart).toHaveBeenCalledOnceWith({
      qs: {
        id: '1'
      }
    });
  });

  it('should setup the memory usage chart', function () {
    expect(getMemoryUsageChart).toHaveBeenCalledOnceWith({
      qs: {
        id: '1'
      }
    });
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
