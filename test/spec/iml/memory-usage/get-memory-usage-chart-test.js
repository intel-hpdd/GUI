describe('the memory usage chart', function () {
  'use strict';

  var chartCompiler, resolveStream, getMemoryUsageStream, memoryUsageStream,
    getTimeParams, buff, requestDuration, formatBytes,
    requestRange, chartPlugins, streams, chart;

  beforeEach(module('memoryUsageModule', function ($provide) {
    resolveStream = jasmine
      .createSpy('resolveStream')
      .andCallFake(_.identity);

    $provide.value('resolveStream', resolveStream);

    streams = [];

    getMemoryUsageStream = jasmine.createSpy('getMemoryUsageStream')
      .andCallFake(function () {
        memoryUsageStream = highland();
        spyOn(memoryUsageStream, 'destroy');
        streams.push(memoryUsageStream);
        return memoryUsageStream;
      });

    $provide.value('getMemoryUsageStream', getMemoryUsageStream);

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

    formatBytes = jasmine.createSpy('formatBytes')
      .andReturn('formatter');
    $provide.value('formatBytes', formatBytes);
  }));

  var memoryUsageChart, getMemoryUsageChart, DURATIONS;

  beforeEach(inject(function (_getMemoryUsageChart_, _DURATIONS_) {
    DURATIONS = _DURATIONS_;

    getMemoryUsageChart = _getMemoryUsageChart_;
    memoryUsageChart = getMemoryUsageChart({
      qs: {
        host_id: '1'
      }
    });

    chart = chartCompiler.mostRecentCall.args[1];
  }));

  it('should return a factory function', function () {
    expect(getMemoryUsageChart).toEqual(jasmine.any(Function));
  });

  it('should setup the chart', function () {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith('iml/memory-usage/assets/html/memory-usage-chart.html', {
        configure: false,
        stream: memoryUsageStream,
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

    expect(memoryUsageStream.destroy).toHaveBeenCalledOnce();
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
        expect(getMemoryUsageStream)
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
        expect(getMemoryUsageStream)
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
    var setup, chart;

    beforeEach(function () {
      chart = {
        useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
        yAxis: {
          tickFormat: jasmine.createSpy('tickFormat')
        },
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

    it('should set y tick format', function () {
      expect(chart.yAxis.tickFormat)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should not show max and min on the x axis', function () {
      expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
    });
  });
});
