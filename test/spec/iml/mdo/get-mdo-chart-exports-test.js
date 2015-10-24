import {getMdoChartFactory} from
  '../../../../source/chroma_ui/iml/mdo/get-mdo-chart-exports';

describe('MDO chart', () => {
  var chartCompiler, getMdoStream,
    durationStream, rangeStream,
    createStream, DURATIONS, formatNumber,
    mdoChart, getMdoChart;

  beforeEach(() => {
    getMdoStream = {};

    chartCompiler = jasmine.createSpy('chartCompiler');

    durationStream = jasmine.createSpy('durationStream')
      .andCallFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .andCallFake(() => highland());

    createStream = {
      durationStream: fp.curry(4, durationStream),
      rangeStream: fp.curry(4, rangeStream)
    };

    DURATIONS = {
      MINUTES: 'minutes'
    };

    formatNumber = jasmine.createSpy('formatNumber')
      .andReturn('formatter');

    getMdoChart = getMdoChartFactory(createStream, getMdoStream, DURATIONS,
      chartCompiler, formatNumber);

    mdoChart = getMdoChart({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should return a factory function', () => {
    expect(getMdoChart).toEqual(jasmine.any(Function));
  });

  it('should call the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      'iml/mdo/assets/html/mdo.html',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith(getMdoStream, {
      qs: {
        host_id: '1'
      }
    }, 10, 'minutes');
  });

  describe('setup', () => {
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

      expect(stream.destroy).toHaveBeenCalledOnce();
    });

    describe('chart', () => {
      var chart, formatter, tickFormat;

      beforeEach(() => {
        formatter = {};

        tickFormat = jasmine.createSpy('tickFormat');

        chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          interactiveLayer: {
            tooltip: {
              headerFormatter: jasmine.createSpy('headerFormatter')
            }
          },
          yAxis: {
            tickFormat: tickFormat
          },
          forceY: jasmine.createSpy('forceY'),
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          }
        };

        config.options.setup(chart);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should should force y', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(tickFormat)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should not show max or min over the x axis', () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
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
          expect(durationStream).toHaveBeenCalledOnceWith(getMdoStream, {
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
          expect(rangeStream).toHaveBeenCalledOnceWith(getMdoStream, {
            qs: {
              host_id: '1'
            }
          }, '2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });
  });
});