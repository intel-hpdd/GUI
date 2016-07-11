import highland from 'highland';
import {curry} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('memory usage chart', () => {
  var chartCompiler, createStream, getMemoryUsageStream,
    durationStream, rangeStream, getMemoryUsageChartFactory,
    getMemoryUsageChart;

  beforeEachAsync(async function () {
    getMemoryUsageStream = {};

    const mod = await mock('source/iml/memory-usage/get-memory-usage-chart.js', {
      'source/iml/memory-usage/get-memory-usage-stream.js': { default: getMemoryUsageStream }
    });
    getMemoryUsageChartFactory = mod.default;
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

    getMemoryUsageChart = getMemoryUsageChartFactory(createStream, chartCompiler);

    getMemoryUsageChart({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should return a factory function', () => {
    expect(getMemoryUsageChart).toEqual(jasmine.any(Function));
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      '/static/chroma_ui/source/iml/memory-usage/assets/html/memory-usage-chart.js',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith({
      qs: {
        host_id: '1'
      }
    }, getMemoryUsageStream, 10, 'minutes');
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
        stream: jasmine.any(Object),
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
      var d3Chart;

      beforeEach(() => {
        d3Chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          }
        };

        config.options.setup(d3Chart);
      });

      it('should use interactive guideline', () => {
        expect(d3Chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should set y tick format', () => {
        expect(d3Chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should not show max and min on the x axis', () => {
        expect(d3Chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
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
          }, getMemoryUsageStream, 5, 'hours');
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
          }, getMemoryUsageStream, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });
});
