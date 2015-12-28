import angular from 'angular';
const {inject} = angular.mock;

import {__, invoke} from 'intel-fp/fp';

import {getOstBalanceChartFactory} from
  '../../../../source/chroma_ui/iml/ost-balance/get-ost-balance-chart-exports';

describe('get ost balance chart', () => {
  var getOstBalanceStream,
    chartCompiler, streamWhenVisible,
    getOstBalanceChart;

  beforeEach(() => {
    streamWhenVisible = jasmine.createSpy('streamWhenVisible')
      .andCallFake(invoke(__, []));

    getOstBalanceStream = jasmine.createSpy('getOstBalanceStream')
      .andCallFake(() => highland());

    chartCompiler = jasmine.createSpy('chartCompiler');

    getOstBalanceChart = getOstBalanceChartFactory(chartCompiler,
      streamWhenVisible, getOstBalanceStream);

    getOstBalanceChart({
      qs: {
        filesystem_id: '1'
      }
    });
  });

  it('should return a factory function', () => {
    expect(getOstBalanceChart)
      .toEqual(jasmine.any(Function));
  });

  it('should call streamWhenVisible', function () {
    expect(streamWhenVisible)
      .toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should setup the OstBalanceChart', () => {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith(
        'iml/ost-balance/assets/html/ost-balance.html',
        jasmine.any(Object),
        jasmine.any(Function)
      );
  });

  it('should create a new stream', function () {
    expect(getOstBalanceStream)
      .toHaveBeenCalledOnceWith(0, {
        qs: {
          filesystem_id: '1'
        }
      });
  });

  describe('conf setup', () => {
    var fn, s, $scope, conf;

    beforeEach(inject(($rootScope) => {
      fn = chartCompiler.calls[0].args[2];

      s = highland();
      spyOn(s, 'destroy');

      $scope = $rootScope.$new();

      conf = fn($scope, s);
    }));

    it('should setup the conf', function () {
      expect(conf).toEqual({
        percentage: 0,
        stream: s,
        onSubmit: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        }
      });
    });

    it('should destroy the existing stream', function () {
      $scope.$destroy();
      expect(s.destroy)
        .toHaveBeenCalledOnce();
    });

    describe('on submit', () => {
      beforeEach(() => {
        conf.percentage = 10;
        conf.onSubmit();
      });

      it('should create a new stream', () => {
        expect(getOstBalanceStream)
          .toHaveBeenCalledOnceWith(10, {
            qs: {
              filesystem_id: '1'
            }
          });
      });

      it('should call streamWhenVisible', function () {
        expect(streamWhenVisible)
          .toHaveBeenCalledTwiceWith(jasmine.any(Function));
      });

      it('should destroy the existing stream', () => {
        expect(s.destroy).toHaveBeenCalledOnce();
      });
    });

    describe('setup', () => {
      var d3Chart, d3, formatter;

      beforeEach(() => {
        d3Chart = {
          forceY: jasmine.createSpy('forceY'),
          stacked: jasmine.createSpy('stacked'),
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          showXAxis: jasmine.createSpy('showXAxis'),
          tooltip: {
            contentGenerator: jasmine.createSpy('contentGenerator')
          }
        };

        formatter = {};

        d3 = {
          format: jasmine.createSpy('format').andReturn(formatter)
        };

        conf.options.setup(d3Chart, d3);
      });

      it('should force Y', () => {
        expect(d3Chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set to stacked', () => {
        expect(d3Chart.stacked).toHaveBeenCalledOnceWith(true);
      });

      it('should set tick format on the Y axis', () => {
        expect(d3Chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(formatter);
      });

      it('should generate tooltip content', () => {
        expect(d3Chart.tooltip.contentGenerator)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });
    });
  });
});
