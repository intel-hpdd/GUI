import highland from 'highland';
import {curry} from 'intel-fp';
import {getHostCpuRamChartFactory} from
  '../../../../source/iml/host-cpu-ram-chart/get-host-cpu-ram-chart';

describe('host cpu ram chart', () => {
  var chartCompiler, getHostCpuRamStream, getHostCpuRamChart,
    DURATIONS,
    durationStream, rangeStream, createStream;

  beforeEach(() => {
    getHostCpuRamStream = {};

    durationStream = jasmine.createSpy('durationStream')
      .and.callFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .and.callFake(() => highland());

    createStream = {
      durationStream: curry(4, durationStream),
      rangeStream: curry(4, rangeStream)
    };

    chartCompiler = jasmine.createSpy('chartCompiler');

    DURATIONS = {
      MINUTES: 'minutes'
    };

    getHostCpuRamChart = getHostCpuRamChartFactory(createStream,
      getHostCpuRamStream, DURATIONS, chartCompiler);

    getHostCpuRamChart('Metadata Servers', {
      qs: { role: 'MDS' }
    });
  });

  it('should return a factory function', () => {
    expect(getHostCpuRamChart).toEqual(jasmine.any(Function));
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      '/static/chroma_ui/source/iml/host-cpu-ram-chart/assets/html/host-cpu-ram-chart.js',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith(getHostCpuRamStream, {
      qs: { role: 'MDS' }
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
        title: 'Metadata Servers',
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
          color: jasmine.createSpy('color')
        };

        config.options.setup(chart, d3);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should should force y', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(chart.yAxis.tickFormat)
          .toHaveBeenCalledOnceWith(formatter);
      });

      it('should should create a tick formatter', () => {
        expect(d3.format).toHaveBeenCalledOnceWith('.1%');
      });

      it('should set colors', () => {
        expect(chart.color)
          .toHaveBeenCalledOnceWith(['#F3B600', '#0067B4']);
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
          expect(durationStream).toHaveBeenCalledOnceWith(getHostCpuRamStream, {
            qs: { role: 'MDS' }
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
          expect(rangeStream).toHaveBeenCalledOnceWith(getHostCpuRamStream, {
            qs: { role: 'MDS' }
          }, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });


});
