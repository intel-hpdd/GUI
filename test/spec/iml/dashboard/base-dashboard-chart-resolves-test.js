import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('base dashboard resolves', () => {
  let baseDashboardChartResolves, baseDashboardFsStream;

  beforeEachAsync(async function() {
    const mod = await mock(
      'source/iml/dashboard/base-dashboard-chart-resolves.js',
      {}
    );

    ({
      baseDashboardChartResolves,
      baseDashboardFsStream
    } = mod);
  });

  afterEach(resetAll);

  describe('charts', () => {
    let getHostCpuRamChart,
      getOstBalanceChart,
      getMdoChart,
      getReadWriteBandwidthChart,
      getReadWriteHeatMapChart,
      getFileUsageChart,
      getSpaceUsageChart,
      getInst,
      $stateParams,
      mdsChart,
      ossChart,
      ostBalanceChart,
      mdoChart,
      readWriteBandwidthChart,
      fileUsageChart,
      readWriteHeatMapChart,
      spaceUsageChart;

    beforeEach(() => {
      mdsChart = { name: 'mdsChart' };
      ossChart = { name: 'ossChart' };
      getHostCpuRamChart = jasmine
        .createSpy('getHostCpuRamChart')
        .and.callFake(title => {
          if (title === 'Metadata Servers') return mdsChart;
          else if (title === 'Object Storage Servers') return ossChart;
        });

      ostBalanceChart = { name: 'ostBalanceChart' };
      getOstBalanceChart = jasmine
        .createSpy('getOstBalanceChart')
        .and.returnValue(ostBalanceChart);

      mdoChart = { name: 'mdoChart' };
      getMdoChart = jasmine.createSpy('getMdoChart').and.returnValue(mdoChart);

      readWriteBandwidthChart = { name: 'readWriteBandwidthChart' };
      getReadWriteBandwidthChart = jasmine
        .createSpy('getReadWriteBandwidthChart')
        .and.returnValue(readWriteBandwidthChart);

      readWriteHeatMapChart = { name: 'readWriteHeatMapChart' };
      getReadWriteHeatMapChart = jasmine
        .createSpy('getReadWriteHeatMapChart')
        .and.returnValue(readWriteHeatMapChart);

      fileUsageChart = { name: 'fileUsageChart' };
      getFileUsageChart = jasmine
        .createSpy('getFileUsageChart')
        .and.returnValue(fileUsageChart);

      spaceUsageChart = { name: 'spaceUsageChart' };
      getSpaceUsageChart = jasmine
        .createSpy('getSpaceUsageChart')
        .and.returnValue(spaceUsageChart);

      $stateParams = {};

      getInst = baseDashboardChartResolves.bind(
        null,
        $stateParams,
        getHostCpuRamChart,
        getOstBalanceChart,
        getMdoChart,
        getReadWriteBandwidthChart,
        getReadWriteHeatMapChart,
        getFileUsageChart,
        getSpaceUsageChart
      );
    });

    it('should be a function', () => {
      expect(baseDashboardChartResolves).toEqual(jasmine.any(Function));
    });

    describe('without fs id', () => {
      beforeEach(() => {
        getInst();
      });

      it('should get the read write heat map chart', () => {
        expect(getReadWriteHeatMapChart).toHaveBeenCalledOnceWith({}, 'base');
      });

      it('should get the ost balance chart', () => {
        expect(getOstBalanceChart).toHaveBeenCalledOnceWith({}, 'base');
      });

      it('should get the mdo chart', () => {
        expect(getMdoChart).toHaveBeenCalledOnceWith({}, 'base');
      });

      it('should get the read write bandwidth chart', () => {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({}, 'base');
      });

      it('should get the mds chart', () => {
        expect(getHostCpuRamChart).toHaveBeenCalledOnceWith(
          'Metadata Servers',
          {
            qs: { role: 'MDS' }
          },
          'mdsbase'
        );
      });

      it('should get the oss chart', () => {
        expect(getHostCpuRamChart).toHaveBeenCalledOnceWith(
          'Object Storage Servers',
          {
            qs: { role: 'OSS' }
          },
          'ossbase'
        );
      });

      it('should get the file usage chart', () => {
        expect(getFileUsageChart).toHaveBeenCalledOnceWith(
          'File Usage',
          'Files Used',
          {},
          'fileusagebase'
        );
      });

      it('should get the space usage chart', () => {
        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith(
          {},
          'spaceusagebase'
        );
      });
    });

    describe('with fs id', () => {
      let promise;

      beforeEach(() => {
        $stateParams.id = '1';
        promise = getInst();
      });

      it('should get the read write heat map chart', () => {
        expect(getReadWriteHeatMapChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              filesystem_id: '1'
            }
          },
          '1'
        );
      });

      it('should get the ost balance chart', () => {
        expect(getOstBalanceChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              filesystem_id: '1'
            }
          },
          '1'
        );
      });

      it('should get the mdo chart', () => {
        expect(getMdoChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              filesystem_id: '1'
            }
          },
          '1'
        );
      });

      it('should get the read write bandwidth chart', () => {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              filesystem_id: '1'
            }
          },
          '1'
        );
      });

      it('should get the mds chart', () => {
        expect(getHostCpuRamChart).toHaveBeenCalledOnceWith(
          'Metadata Servers',
          {
            qs: {
              role: 'MDS',
              filesystem_id: '1'
            }
          },
          'mds1'
        );
      });

      it('should get the oss chart', () => {
        expect(getHostCpuRamChart).toHaveBeenCalledOnceWith(
          'Object Storage Servers',
          {
            qs: {
              role: 'OSS',
              filesystem_id: '1'
            }
          },
          'oss1'
        );
      });

      it('should get the file usage chart', () => {
        expect(getFileUsageChart).toHaveBeenCalledOnceWith(
          'File Usage',
          'Files Used',
          {},
          'fileusagebase'
        );
      });

      it('should get the space usage chart', () => {
        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith(
          {},
          'spaceusagebase'
        );
      });

      itAsync('should return an array of charts', async function() {
        const streams = await promise;

        expect(streams).toEqual([
          readWriteHeatMapChart,
          ostBalanceChart,
          mdoChart,
          readWriteBandwidthChart,
          fileUsageChart,
          spaceUsageChart,
          mdsChart,
          ossChart
        ]);
      });
    });
  });

  describe('fs stream', () => {
    let $stateParams, fsStream, b;

    beforeEach(() => {
      $stateParams = {
        id: 1
      };
      fsStream = highland();

      b = baseDashboardFsStream(() => fsStream, $stateParams);
    });

    it('should stream data', () => {
      let result;

      fsStream.write([
        {
          id: 1,
          foo: 'bar'
        }
      ]);

      b().each(x => result = x);

      expect(result).toEqual([
        {
          id: 1,
          foo: 'bar'
        }
      ]);
    });
  });
});
