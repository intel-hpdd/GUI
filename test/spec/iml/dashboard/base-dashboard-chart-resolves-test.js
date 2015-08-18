describe('base dashboard resolves', function () {
  'use strict';

  var $route;

  beforeEach(module('dashboard', function ($provide) {
    $route = {
      current: {
        params: {}
      }
    };
    $provide.value('$route', $route);
  }));

  describe('charts', function () {
    var getHostCpuRamChart, getOstBalanceChart,
      getMdoChart, getReadWriteBandwidthChart,
      getReadWriteHeatMapChart,
      mdsChart, ossChart, ostBalanceChart, mdoChart, readWriteBandwidthChart,
      readWriteHeatMapChart;

    beforeEach(module('dashboard', function ($provide) {
      mdsChart = { name: 'mdsChart' };
      ossChart = { name: 'ossChart' };
      getHostCpuRamChart = jasmine.createSpy('getHostCpuRamChart')
        .andCallFake(function (title) {
          if (title === 'Metadata Servers')
            return mdsChart;
          else if (title === 'Object Storage Servers')
            return ossChart;
        });
      $provide.value('getHostCpuRamChart', getHostCpuRamChart);

      ostBalanceChart = { name: 'ostBalanceChart' };
      getOstBalanceChart = jasmine.createSpy('getOstBalanceChart')
        .andReturn(ostBalanceChart);
      $provide.value('getOstBalanceChart', getOstBalanceChart);

      mdoChart = { name: 'mdoChart' };
      getMdoChart = jasmine.createSpy('getMdoChart')
        .andReturn(mdoChart);
      $provide.value('getMdoChart', getMdoChart);

      readWriteBandwidthChart = { name: 'readWriteBandwidthChart' };
      getReadWriteBandwidthChart = jasmine.createSpy('getReadWriteBandwidthChart')
        .andReturn(readWriteBandwidthChart);
      $provide.value('getReadWriteBandwidthChart', getReadWriteBandwidthChart);

      readWriteHeatMapChart = { name: 'readWriteHeatMapChart' };
      getReadWriteHeatMapChart = jasmine.createSpy('getReadWriteHeatMapChart')
        .andReturn(readWriteHeatMapChart);
      $provide.value('getReadWriteHeatMapChart', getReadWriteHeatMapChart);
    }));

    var $rootScope, baseDashboardChartResolves;

    beforeEach(inject(function (_$rootScope_, _baseDashboardChartResolves_) {
      $rootScope = _$rootScope_;

      baseDashboardChartResolves = _baseDashboardChartResolves_;
    }));

    it('should be a function', function () {
      expect(baseDashboardChartResolves).toEqual(jasmine.any(Function));
    });

    describe('without fs id', function () {
      var promise;

      beforeEach(function () {
        promise = baseDashboardChartResolves();
      });

      it('should get the read write heat map chart', function () {
        expect(getReadWriteHeatMapChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the ost balance chart', function () {
        expect(getOstBalanceChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the mdo chart', function () {
        expect(getMdoChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the read write bandwidth chart', function () {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({});
      });

      it('should get the mds chart', function () {
        expect(getHostCpuRamChart)
          .toHaveBeenCalledOnceWith(
          'Metadata Servers',
          {
            qs: { role: 'MDS' }
          }
        );
      });

      it('should get the oss chart', function () {
        expect(getHostCpuRamChart)
          .toHaveBeenCalledOnceWith(
          'Object Storage Servers',
          {
            qs: { role: 'OSS' }
          }
        );
      });
    });

    describe('with fs id', function () {
      var promise;

      beforeEach(function () {
        $route.current.params.fsId = '1';
        promise = baseDashboardChartResolves();
      });

      it('should get the read write heat map chart', function () {
        expect(getReadWriteHeatMapChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the ost balance chart', function () {
        expect(getOstBalanceChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the mdo chart', function () {
        expect(getMdoChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the read write bandwidth chart', function () {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: '1'
          }
        });
      });

      it('should get the mds chart', function () {
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

      it('should get the oss chart', function () {
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

      it('should return an array of charts', function () {
        promise.then(function (streams) {
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

  describe('fs stream', function () {
    var socketStream, s;

    beforeEach(module(function ($provide) {
      s = highland();
      socketStream = jasmine.createSpy('socketStream')
        .andReturn(s);
      $provide.value('socketStream', socketStream);
    }));

    var $rootScope, baseDashboardFsStream;

    beforeEach(inject(function (_$rootScope_, _baseDashboardFsStream_) {
      $rootScope = _$rootScope_;
      baseDashboardFsStream = _baseDashboardFsStream_;
    }));

    describe('with id', function () {
      var promise;

      beforeEach(function () {
        $route.current.params.fsId = '1';
        promise = baseDashboardFsStream();
      });

      it('should call socketStream', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
          jsonMask: 'objects(name,bytes_total,bytes_free,files_free,files_total,client_count,immutable_state,\
id,osts,mdts(id),mgt(primary_server,primary_server_name)',
          qs: {
            id: '1'
          }
        });
      });

      it('should stream data', function () {
        var result;

        promise.then(function (s) {
          s.each(function (x) {
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

    describe('without id', function () {
      var promise;

      beforeEach(function () {
        promise = baseDashboardFsStream();
      });

      it('should call socketStream', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
          jsonMask: 'objects(name,bytes_total,bytes_free,files_free,files_total,client_count,immutable_state,\
id,osts,mdts(id),mgt(primary_server,primary_server_name)',
          qs: {}
        });
      });

      it('should stream data', function () {
        var result;

        promise.then(function (s) {
          s.each(function (x) {
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
