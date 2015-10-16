import { getMemoryUsageChartFactory } from
  '../../../../source/chroma_ui/iml/memory-usage/get-memory-usage-chart-exports';

describe('memory usage chart', () => {
  var chartCompiler, createStream, getMemoryUsageStream,
  durationStream, rangeStream,
  formatBytes, memoryUsageChart, getMemoryUsageChart, DURATIONS;

  beforeEach(() => {
    getMemoryUsageStream = {};

    durationStream = jasmine.createSpy('durationStream')
      .andCallFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .andCallFake(() => highland());

    createStream = {
      durationStream: fp.curry(4, durationStream),
      rangeStream: fp.curry(4, rangeStream)
    };

    chartCompiler = jasmine.createSpy('chartCompiler');

    formatBytes = jasmine.createSpy('formatBytes')
      .andReturn('formatter');

    DURATIONS = {
      MINUTES: 'minutes'
    };

    getMemoryUsageChart = getMemoryUsageChartFactory(getMemoryUsageStream, createStream,
      DURATIONS, chartCompiler, formatBytes);

    memoryUsageChart = getMemoryUsageChart({
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
      'iml/memory-usage/assets/html/memory-usage-chart.html',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith(getMemoryUsageStream, {
      qs: {
        host_id: '1'
      }
    }, 10, 'minutes');
  });

  describe('config', () => {
    var handler, $scope, stream,
      config;

    beforeEach(inject(($rootScope) => {
      handler = chartCompiler.mostRecentCall.args[2];

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
          expect(durationStream).toHaveBeenCalledOnceWith(getMemoryUsageStream, {
            qs: {
              host_id: '1'
            }
          }, 5, 'hours');
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
          expect(rangeStream).toHaveBeenCalledOnceWith(getMemoryUsageStream, {
            qs: {
              host_id: '1'
            }
          }, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });
});
