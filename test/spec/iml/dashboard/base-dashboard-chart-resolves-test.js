describe('base dashboard resolves', () => {
  let baseDashboardChartResolves;

  beforeEach(() => {
    const mod = require('../../../../source/iml/dashboard/base-dashboard-chart-resolves.js');

    ({ baseDashboardChartResolves } = mod);
  });

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
      getHostCpuRamChart = jest.fn(title => {
        if (title === 'Metadata Servers') return mdsChart;
        else if (title === 'Object Storage Servers') return ossChart;
      });

      ostBalanceChart = { name: 'ostBalanceChart' };
      getOstBalanceChart = jest.fn(() => ostBalanceChart);

      mdoChart = { name: 'mdoChart' };
      getMdoChart = jest.fn(() => mdoChart);

      readWriteBandwidthChart = { name: 'readWriteBandwidthChart' };
      getReadWriteBandwidthChart = jest.fn(() => readWriteBandwidthChart);

      readWriteHeatMapChart = { name: 'readWriteHeatMapChart' };
      getReadWriteHeatMapChart = jest.fn(() => readWriteHeatMapChart);

      fileUsageChart = { name: 'fileUsageChart' };
      getFileUsageChart = jest.fn(() => fileUsageChart);

      spaceUsageChart = { name: 'spaceUsageChart' };
      getSpaceUsageChart = jest.fn(() => spaceUsageChart);

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
      expect(baseDashboardChartResolves).toEqual(expect.any(Function));
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
        expect(getFileUsageChart).toHaveBeenCalledOnceWith('File Usage', 'Files Used', {}, 'fileusagebase');
      });

      it('should get the space usage chart', () => {
        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith({}, 'spaceusagebase');
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
        expect(getFileUsageChart).toHaveBeenCalledOnceWith('File Usage', 'Files Used', {}, 'fileusagebase');
      });

      it('should get the space usage chart', () => {
        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith({}, 'spaceusagebase');
      });

      it('should return an array of charts', async () => {
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
});
