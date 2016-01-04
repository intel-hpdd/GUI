import angular from 'angular';
const {module, inject} = angular.mock;

describe('base dashboard resolves', () => {
  var $route;

  beforeEach(module('baseDashboard', ($provide) => {
    $route = {
      current: {
        params: {}
      }
    };
    $provide.value('$route', $route);
  }));

  describe('charts', () => {
    var getHostCpuRamChart, getOstBalanceChart,
      getMdoChart, getReadWriteBandwidthChart,
      getReadWriteHeatMapChart,
      mdsChart, ossChart, ostBalanceChart, mdoChart, readWriteBandwidthChart,
      readWriteHeatMapChart;

    beforeEach(module('baseDashboard', ($provide) => {
      mdsChart = { name: 'mdsChart' };
      ossChart = { name: 'ossChart' };
      getHostCpuRamChart = jasmine.createSpy('getHostCpuRamChart')
        .and.callFake((title) => {
          if (title === 'Metadata Servers')
            return mdsChart;
          else if (title === 'Object Storage Servers')
            return ossChart;
        });
      $provide.value('getHostCpuRamChart', getHostCpuRamChart);

      ostBalanceChart = { name: 'ostBalanceChart' };
      getOstBalanceChart = jasmine.createSpy('getOstBalanceChart')
        .and.returnValue(ostBalanceChart);
      $provide.value('getOstBalanceChart', getOstBalanceChart);

      mdoChart = { name: 'mdoChart' };
      getMdoChart = jasmine.createSpy('getMdoChart')
        .and.returnValue(mdoChart);
      $provide.value('getMdoChart', getMdoChart);

      readWriteBandwidthChart = { name: 'readWriteBandwidthChart' };
      getReadWriteBandwidthChart = jasmine.createSpy('getReadWriteBandwidthChart')
        .and.returnValue(readWriteBandwidthChart);
      $provide.value('getReadWriteBandwidthChart', getReadWriteBandwidthChart);

      readWriteHeatMapChart = { name: 'readWriteHeatMapChart' };
      getReadWriteHeatMapChart = jasmine.createSpy('getReadWriteHeatMapChart')
        .and.returnValue(readWriteHeatMapChart);
      $provide.value('getReadWriteHeatMapChart', getReadWriteHeatMapChart);
    }));

    var $rootScope, baseDashboardChartResolves;

    beforeEach(inject((_$rootScope_, _baseDashboardChartResolves_) => {
      $rootScope = _$rootScope_;

      baseDashboardChartResolves = _baseDashboardChartResolves_;
    }));

    it('should be a function', () => {
      expect(baseDashboardChartResolves).toEqual(jasmine.any(Function));
    });

    describe('without fs id', () => {
      beforeEach(() => {
        baseDashboardChartResolves();
      });

      it('should get the read write heat map chart', () => {
        expect(getReadWriteHeatMapChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the ost balance chart', () => {
        expect(getOstBalanceChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the mdo chart', () => {
        expect(getMdoChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the read write bandwidth chart', () => {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the mds chart', () => {
        expect(getHostCpuRamChart)
          .toHaveBeenCalledOnceWith(
          'Metadata Servers',
          {
            qs: { role: 'MDS' }
          }
        );
      });

      it('should get the oss chart', () => {
        expect(getHostCpuRamChart)
          .toHaveBeenCalledOnceWith(
          'Object Storage Servers',
          {
            qs: { role: 'OSS' }
          }
        );
      });
    });

    describe('with fs id', () => {
      var promise;

      beforeEach(() => {
        $route.current.params.fsId = '1';
        promise = baseDashboardChartResolves();
      });

      it('should get the read write heat map chart', () => {
        expect(getReadWriteHeatMapChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the ost balance chart', () => {
        expect(getOstBalanceChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the mdo chart', () => {
        expect(getMdoChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the read write bandwidth chart', () => {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the mds chart', () => {
        expect(getHostCpuRamChart)
          .toHaveBeenCalledOnceWith(
          'Metadata Servers',
          {
            qs: {
              role: 'MDS',
              filesystem_id: '1'
            }
          }
        );
      });

      it('should get the oss chart', () => {
        expect(getHostCpuRamChart)
          .toHaveBeenCalledOnceWith(
          'Object Storage Servers',
          {
            qs: {
              role: 'OSS',
              filesystem_id: '1'
            }
          }
        );
      });

      it('should return an array of charts', () => {
        promise.then((streams) => {
          expect(streams).toEqual([
            readWriteHeatMapChart,
            ostBalanceChart,
            mdoChart,
            readWriteBandwidthChart,
            mdsChart,
            ossChart
          ]);
        });

        $rootScope.$apply();
      });
    });
  });

  describe('fs stream', () => {
    var socketStream, s;

    beforeEach(module(($provide) => {
      s = highland();
      socketStream = jasmine.createSpy('socketStream')
        .and.returnValue(s);
      $provide.value('socketStream', socketStream);
    }));

    var $rootScope, baseDashboardFsStream;

    beforeEach(inject((_$rootScope_, _baseDashboardFsStream_) => {
      $rootScope = _$rootScope_;
      baseDashboardFsStream = _baseDashboardFsStream_;
    }));

    describe('with id', () => {
      var promise;

      beforeEach(() => {
        $route.current.params.fsId = '1';
        promise = baseDashboardFsStream();
      });

      it('should call socketStream', () => {
        expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
          jsonMask: 'objects(name,bytes_total,bytes_free,files_free,files_total,client_count,immutable_state,\
id,osts,mdts(id),mgt(primary_server,primary_server_name)',
          qs: {
            id: '1'
          }
        });
      });

      it('should stream data', () => {
        var result;

        promise.then((s) => {
          s.each((x) => {
            result = x;
          });
        });

        s.write({
          objects: ['foo']
        });
        $rootScope.$apply();

        expect(result).toEqual(['foo']);
      });
    });

    describe('without id', () => {
      var promise;

      beforeEach(() => {
        promise = baseDashboardFsStream();
      });

      it('should call socketStream', () => {
        expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
          jsonMask: 'objects(name,bytes_total,bytes_free,files_free,files_total,client_count,immutable_state,\
id,osts,mdts(id),mgt(primary_server,primary_server_name)',
          qs: {}
        });
      });

      it('should stream data', () => {
        var result;

        promise.then((s) => {
          s.each((x) => {
            result = x;
          });
        });

        s.write({
          objects: ['foo']
        });
        $rootScope.$apply();

        expect(result).toEqual(['foo']);
      });
    });
  });
});
