import highland from 'highland';
import {
  serverDashboardChartResolves,
  serverDashboardHostStreamResolves
} from '../../../../source/iml/dashboard/server-dashboard-resolves.js';

describe('server dashboard resolves', () => {
  describe('chart resolves', () => {
    let getReadWriteBandwidthChart, getCpuUsageChart, getMemoryUsageChart, $stateParams, promise;

    beforeEach(() => {
      getReadWriteBandwidthChart = jest.fn(() => 'read/write data');

      getMemoryUsageChart = jest.fn(() => 'memory usage data');

      getCpuUsageChart = jest.fn(() => 'cpu usage data');

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
      expect(serverDashboardChartResolves).toEqual(expect.any(Function));
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

    it('should resolve with all the charts', async () => {
      const res = await promise;

      expect(res).toEqual(['read/write data', 'cpu usage data', 'memory usage data']);
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

      s.each(x => (result = x));

      expect(result).toEqual({
        id: 1,
        foo: 'bar'
      });
    });
  });
});
