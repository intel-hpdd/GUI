import highland from 'highland';
import {curry} from 'intel-fp';
import {getReadWriteBandwidthChartFactory} from
  '../../../../source/iml/read-write-bandwidth/get-read-write-bandwidth-chart';

describe('get read write bandwidth chart', () => {
  var chartCompiler, createStream, getReadWriteBandwidthStream, DURATIONS,
    formatBytes, durationStream, rangeStream,
    getReadWriteBandwidthChart;

  beforeEach(() => {
    getReadWriteBandwidthStream = {};

    durationStream = jasmine.createSpy('durationStream')
      .and.callFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .and.callFake(() => highland());

    createStream = {
      durationStream: curry(4, durationStream),
      rangeStream: curry(4, rangeStream)
    };

    chartCompiler = jasmine.createSpy('chartCompiler');

    formatBytes = jasmine.createSpy('formatBytes')
      .and.returnValue('formatter');

    DURATIONS = {
      MINUTES: 'minutes'
    };

    getReadWriteBandwidthChart = getReadWriteBandwidthChartFactory(createStream,
      getReadWriteBandwidthStream, DURATIONS, chartCompiler, formatBytes);

    getReadWriteBandwidthChart({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should return a factory function', () => {
    expect(getReadWriteBandwidthChart).toEqual(jasmine.any(Function));
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      '/static/chroma_ui/source/iml/read-write-bandwidth/assets/html/read-write-bandwidth.js',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith(getReadWriteBandwidthStream, {
      qs: {
        host_id: '1'
      }
    }, 10, 'minutes');
  });

  describe('setup', () => {
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
        unit: DURATIONS.MINUTES
      });
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(stream.destroy).toHaveBeenCalledOnce();
    });

    describe('setup', () => {
      var chart;

      beforeEach(() => {
        chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          },
          yAxis: {
            tickFormat: jasmine.createSpy('tickFormat')
          },
          color: jasmine.createSpy('color'),
          isArea: jasmine.createSpy('isArea')
        };

        config.options.setup(chart);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should set colors', () => {
        expect(chart.color)
          .toHaveBeenCalledOnceWith(['#0067B4', '#E17200']);
      });

      it('should use the area style', () => {
        expect(chart.isArea)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should not show max or min on the x axis', () => {
        expect(chart.xAxis.showMaxMin)
          .toHaveBeenCalledOnceWith(false);
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
          expect(durationStream).toHaveBeenCalledOnceWith(getReadWriteBandwidthStream, {
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
          expect(rangeStream).toHaveBeenCalledOnceWith(getReadWriteBandwidthStream, {
            qs: {
              host_id: '1'
            }
          }, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });
});
