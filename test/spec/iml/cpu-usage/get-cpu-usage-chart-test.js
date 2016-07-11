import angular from 'angular';
const {inject} = angular.mock;
import highland from 'highland';

import {curry} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('cpu usage chart', () => {
  var chartCompiler, getCpuUsageStream,
    durationStream, rangeStream, createStream,
    getCpuUsageChart, getCpuUsageChartFactory;

  beforeEachAsync(async function () {
    getCpuUsageStream = {};

    const mod = await mock('source/iml/cpu-usage/get-cpu-usage-chart.js', {
      'source/iml/cpu-usage/get-cpu-usage-stream.js': { default: getCpuUsageStream }
    });

    getCpuUsageChartFactory = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    durationStream = jasmine.createSpy('durationStream')
      .and.callFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .and.callFake(() => highland());

    createStream = {
      durationStream: curry(4, durationStream),
      rangeStream: curry(4, rangeStream)
    };

    chartCompiler = jasmine.createSpy('chartCompiler');

    getCpuUsageChart = getCpuUsageChartFactory(createStream, chartCompiler);

    getCpuUsageChart({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should return a factory function', () => {
    expect(getCpuUsageChart).toEqual(jasmine.any(Function));
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      '/static/chroma_ui/source/iml/cpu-usage/assets/html/cpu-usage.js',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith({
      qs: {
        host_id: '1'
      }
    }, getCpuUsageStream, 10, 'minutes');
  });

  describe('config', () => {
    var handler, $scope, stream,
      config;

    beforeEach(inject(($rootScope) => {
      handler = chartCompiler.calls.mostRecent().args[2];

      stream = highland();
      spyOn(stream, 'destroy');
      $scope = $rootScope.$new();

      config = handler($scope, stream);
    }));

    it('should return a config', () => {
      expect(config).toEqual({
        stream,
        onSubmit: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        },
        size: 10,
        unit: 'minutes'
      });
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(stream.destroy)
        .toHaveBeenCalledOnce();
    });

    describe('setup', () => {
      var chart, d3, formatter;

      beforeEach(() => {
        formatter = {};

        d3 = {
          format: jasmine.createSpy('format')
            .and.returnValue(formatter)
        };

        chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          forceY: jasmine.createSpy('forceY'),
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          },
          color: jasmine.createSpy('color')
        };

        config.options.setup(chart, d3);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should force y', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(formatter);
      });

      it('should turn off x axis max and min', () => {
        expect(chart.xAxis.showMaxMin)
          .toHaveBeenCalledOnceWith(false);
      });

      it('should should create a tick formatter', () => {
        expect(d3.format).toHaveBeenCalledOnceWith('.1%');
      });

      it('should set colors', () => {
        expect(chart.color)
          .toHaveBeenCalledOnceWith(['#2f7087', '#f09659', '#f0d359']);
      });
    });

    describe('on submit', () => {
      describe('with a duration', () => {
        beforeEach(() => {
          config.onSubmit({
            durationForm: {
              size: { $modelValue: 5 },
              unit: { $modelValue: 'hours' }
            }
          });
        });

        it('should create a duration stream', () => {
          expect(durationStream).toHaveBeenCalledOnceWith({
            qs: {
              host_id: '1'
            }
          }, getCpuUsageStream, 5, 'hours');
        });
      });

      describe('with a range', () => {
        beforeEach(() => {
          config.onSubmit({
            rangeForm: {
              start: { $modelValue: '2015-05-03T07:25' },
              end: { $modelValue: '2015-05-03T07:35' }
            }
          });
        });

        it('should create a range stream', () => {
          expect(rangeStream).toHaveBeenCalledOnceWith({
            qs: {
              host_id: '1'
            }
          }, getCpuUsageStream, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });
});
