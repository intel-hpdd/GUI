describe('the MDO chart', function () {
  'use strict';

  var chartCompiler, resolveStream, getMdoStream, mdoStream,
    getTimeParams, buff, requestDuration,
    requestRange, chartPlugins, streams, chart;

  beforeEach(module('mdo', function ($provide) {
    resolveStream = jasmine
      .createSpy('resolveStream')
      .andCallFake(_.identity);

    $provide.value('resolveStream', resolveStream);

    streams = [];

    getMdoStream = jasmine.createSpy('getMdoStream')
      .andCallFake(function () {
        mdoStream = highland();
        spyOn(mdoStream, 'destroy');
        streams.push(mdoStream);
        return mdoStream;
      });

    $provide.value('getMdoStream', getMdoStream);

    chartCompiler = jasmine.createSpy('chartCompiler');

    $provide.value('chartCompiler', chartCompiler);

    requestDuration = {
      setOverrides: jasmine.createSpy('setOverrides')
    };

    requestRange = {
      setOverrides: jasmine.createSpy('setOverrides')
    };

    getTimeParams = {
      getRequestDuration: jasmine.createSpy('getRequestDuration')
        .andReturn(requestDuration),
      getRequestRange: jasmine.createSpy('getRequestRange')
        .andReturn(requestRange)
    };

    $provide.value('getTimeParams', getTimeParams);

    buff = {};

    chartPlugins = {
      bufferDataNewerThan: jasmine.createSpy('bufferDataNewerThan')
        .andReturn(buff)
    };

    $provide.value('chartPlugins', chartPlugins);
  }));

  var mdoChart, getMdoChart, DURATIONS;

  beforeEach(inject(function (_getMdoChart_, _DURATIONS_) {
    DURATIONS = _DURATIONS_;

    getMdoChart = _getMdoChart_;
    mdoChart = getMdoChart({
      qs: {
        host_id: '1'
      }
    });

    chart = chartCompiler.mostRecentCall.args[1];
  }));

  it('should return a factory function', function () {
    expect(getMdoChart).toEqual(jasmine.any(Function));
  });

  it('should setup the mdoChart', function () {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith('iml/mdo/assets/html/mdo.html', {
        configure: false,
        stream: mdoStream,
        onSubmit: jasmine.any(Function),
        onCancel: jasmine.any(Function),
        onConfigure: jasmine.any(Function),
        onDestroy: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        },
        size: 10,
        unit: DURATIONS.MINUTES
      });
  });

  it('should destroy the stream on destroy', function () {
    chart.onDestroy();

    expect(mdoStream.destroy).toHaveBeenCalledOnce();
  });

  it('should set overrides', function () {
    expect(requestDuration.setOverrides).toHaveBeenCalledOnceWith({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should set configure to false on cancel', function () {
    chart.onCancel();

    expect(chart.configure).toBe(false);
  });

  it('should set configure to true on configure', function () {
    chart.onConfigure();

    expect(chart.configure).toBe(true);
  });

  describe('on submit', function () {
    describe('with a duration', function () {
      beforeEach(function () {
        chart.onSubmit({
          durationForm: {
            size: { $modelValue: 5 },
            unit: { $modelValue: 'hours' }
          }
        });
      });

      it('should create a request duration', function () {
        expect(getTimeParams.getRequestDuration)
          .toHaveBeenCalledOnceWith(5, 'hours');
      });

      it('should create a time buffer', function () {
        expect(chartPlugins.bufferDataNewerThan)
          .toHaveBeenCalledOnceWith(5, 'hours');
      });

      it('should create a new stream', function () {
        expect(getMdoStream)
          .toHaveBeenCalledTwiceWith(requestDuration, buff);
      });

      it('should set overrides', function () {
        expect(requestDuration.setOverrides).toHaveBeenCalledTwiceWith({
          qs: {
            host_id: '1'
          }
        });
      });

      it('should destroy the existing stream', function () {
        expect(streams[0].destroy).toHaveBeenCalledOnce();
      });
    });

    describe('with a range', function () {
      beforeEach(function () {
        chart.onSubmit({
          rangeForm: {
            start: { $modelValue: '2015-05-03T07:25' },
            end: { $modelValue: '2015-05-03T07:35' }
          }
        });
      });

      it('should create a request range', function () {
        expect(getTimeParams.getRequestRange)
          .toHaveBeenCalledOnceWith('2015-05-03T07:25', '2015-05-03T07:35');
      });

      it('should not create a buffer', function () {
        //Called during stream setup
        expect(chartPlugins.bufferDataNewerThan)
          .toHaveBeenCalledOnce();
      });

      it('should create a new stream', function () {
        expect(getMdoStream)
          .toHaveBeenCalledOnceWith(requestRange, jasmine.any(Function));
      });

      it('should set overrides', function () {
        expect(requestRange.setOverrides).toHaveBeenCalledOnceWith({
          qs: {
            host_id: '1'
          }
        });
      });

      it('should destroy the existing stream', function () {
        expect(streams[0].destroy).toHaveBeenCalledOnce();
      });
    });
  });

  describe('setup', function () {
    var setup, chart, formatter, tickFormat;

    beforeEach(function () {
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

      setup = chartCompiler.mostRecentCall.args[1].options.setup;
      setup(chart);
    });

    it('should use interactive guideline', function () {
      expect(chart.useInteractiveGuideline)
        .toHaveBeenCalledOnceWith(true);
    });

    it('should should force y', function () {
      expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
    });

    it('should set y tick format', function () {
      expect(tickFormat)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should not show max or min over the x axis', function () {
      expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
    });
  });
});
