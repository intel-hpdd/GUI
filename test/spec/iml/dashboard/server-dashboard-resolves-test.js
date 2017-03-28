import { mock, resetAll } from '../../../system-mock.js';

import highland from 'highland';

describe('server dashboard resolves', () => {
  let serverDashboardChartResolves, serverDashboardHostStreamResolves;

  beforeEachAsync(async function() {
    const mod = await mock(
      'source/iml/dashboard/server-dashboard-resolves.js',
      {}
    );

    ({
      serverDashboardChartResolves,
      serverDashboardHostStreamResolves
    } = mod);
  });

  afterEach(resetAll);

  describe('chart resolves', () => {
    let getReadWriteBandwidthChart,
      getCpuUsageChart,
      getMemoryUsageChart,
      $stateParams,
      promise;

    beforeEach(() => {
      getReadWriteBandwidthChart = jasmine
        .createSpy('getReadWriteBandwidthChart')
        .and.returnValue('read/write data');

      getMemoryUsageChart = jasmine
        .createSpy('getMemoryUsageChart')
        .and.returnValue('memory usage data');

      getCpuUsageChart = jasmine
        .createSpy('getCpuUsageChart')
        .and.returnValue('cpu usage data');

      $stateParams = {
        id: '1'
      };

      promise = serverDashboardChartResolves(
        $stateParams,
        getReadWriteBandwidthChart,
        getMemoryUsageChart,
        getCpuUsageChart
      );
    });

    it('should return a function', () => {
      expect(serverDashboardChartResolves).toEqual(jasmine.any(Function));
    });

    it('should setup the read write bandwidth chart', () => {
      expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith(
        {
          qs: {
            host_id: '1'
          }
        },
        'server1'
      );
    });

    it('should setup the cpu usage chart', () => {
      expect(getCpuUsageChart).toHaveBeenCalledOnceWith(
        {
          qs: {
            id: '1'
          }
        },
        'server1'
      );
    });

    it('should setup the memory usage chart', () => {
      expect(getMemoryUsageChart).toHaveBeenCalledOnceWith(
        {
          qs: {
            id: '1'
          }
        },
        'server1'
      );
    });

    it('should be a promise', () => {
      expect(promise).toBeAPromise();
    });

    itAsync('should resolve with all the charts', async function() {
      const res = await promise;

      expect(res).toEqual([
        'read/write data',
        'cpu usage data',
        'memory usage data'
      ]);
    });
  });

  describe('host stream resolves', () => {
    let $stateParams, hostStream, s;

    beforeEach(() => {
      $stateParams = {
        id: 1
      };

      hostStream = highland();

      s = serverDashboardHostStreamResolves($stateParams, () => hostStream);
    });

    it('should write to the stream', () => {
      hostStream.write([
        {
          id: 1,
          foo: 'bar'
        }
      ]);

      let result;

      s.each(x => result = x);

      expect(result).toEqual({
        id: 1,
        foo: 'bar'
      });
    });
  });
});
