import highland from 'highland';

import {curry} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('space usage chart', () => {
  var chartCompiler, getSpaceUsageStream,
    durationStream, rangeStream, createStream,
    getSpaceUsageChart, getSpaceUsageChartFactory;

  beforeEachAsync(async function () {
    getSpaceUsageStream = {};
    const mod = await mock('source/iml/space-usage/get-space-usage-chart.js', {
      'source/iml/space-usage/get-space-usage-stream.js': { default: getSpaceUsageStream }
    });
    getSpaceUsageChartFactory = mod.default;
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

    getSpaceUsageChart = getSpaceUsageChartFactory(createStream,
      chartCompiler);

    getSpaceUsageChart({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should return a factory function', () => {
    expect(getSpaceUsageChart).toEqual(jasmine.any(Function));
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      '/static/chroma_ui/source/iml/space-usage/assets/html/space-usage-chart.js',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith(getSpaceUsageStream, {
      qs: {
        host_id: '1'
      }
    }, 10, 'minutes');
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
        size: 10,
        unit: 'minutes',
        onSubmit: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        }
      });
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(stream.destroy)
        .toHaveBeenCalledOnce();
    });

    describe('setup', () => {
      var chart, formatter;

      beforeEach(() => {
        formatter = {};

        var d3 = {
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
          color: jasmine.createSpy('color'),
          isArea: jasmine.createSpy('isArea')
        };

        config.options.setup(chart, d3);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should forceY', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(formatter);
      });

      it('should not show max and min on the x axis', () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });

      it('should set a color', () => {
        expect(chart.color).toHaveBeenCalledOnceWith(['#f05b59']);
      });

      it('should set the chart to area', () => {
        expect(chart.isArea).toHaveBeenCalledOnceWith(true);
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
          expect(durationStream).toHaveBeenCalledOnceWith(getSpaceUsageStream, {
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
          expect(rangeStream).toHaveBeenCalledOnceWith(getSpaceUsageStream, {
            qs: {
              host_id: '1'
            }
          }, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });
});
