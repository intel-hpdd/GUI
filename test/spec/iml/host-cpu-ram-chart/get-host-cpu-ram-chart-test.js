describe('the host cpu ram chart', function () {
  'use strict';

  var chartCompiler, resolveStream, getHostCpuRamStream, hostCpuRamStream,
    getTimeParams, buff, requestDuration,
    requestRange, chartPlugins, streams, chart;

  beforeEach(module('hostCpuRamChart', function ($provide) {
    resolveStream = jasmine
      .createSpy('resolveStream')
      .andCallFake(_.identity);

    $provide.value('resolveStream', resolveStream);

    streams = [];

    getHostCpuRamStream = jasmine.createSpy('getHostCpuRamStream')
      .andCallFake(function () {
        hostCpuRamStream = highland();
        spyOn(hostCpuRamStream, 'destroy');
        streams.push(hostCpuRamStream);
        return hostCpuRamStream;
      });

    $provide.value('getHostCpuRamStream', getHostCpuRamStream);

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

  var hostCpuRamChart, getHostCpuRamChart, DURATIONS;

  beforeEach(inject(function (_getHostCpuRamChart_, _DURATIONS_) {
    DURATIONS = _DURATIONS_;

    getHostCpuRamChart = _getHostCpuRamChart_;
    hostCpuRamChart = getHostCpuRamChart('Metadata Servers', {
      qs: { role: 'MDS' }
    });

    chart = chartCompiler.mostRecentCall.args[1];
  }));

  it('should return a factory function', function () {
    expect(getHostCpuRamChart).toEqual(jasmine.any(Function));
  });

  it('should setup the chart', function () {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith('iml/host-cpu-ram-chart/assets/html/host-cpu-ram-chart.html', {
        title: 'Metadata Servers',
        configure: false,
        stream: hostCpuRamStream,
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

    expect(hostCpuRamStream.destroy).toHaveBeenCalledOnce();
  });

  it('should set overrides', function () {
    expect(requestDuration.setOverrides).toHaveBeenCalledOnceWith({
      qs: { role: 'MDS' }
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
        expect(getHostCpuRamStream)
          .toHaveBeenCalledTwiceWith(requestDuration, buff);
      });

      it('should set overrides', function () {
        expect(requestDuration.setOverrides).toHaveBeenCalledTwiceWith({
          qs: { role: 'MDS' }
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
        expect(getHostCpuRamStream)
          .toHaveBeenCalledOnceWith(requestRange, jasmine.any(Function));
      });

      it('should set overrides', function () {
        expect(requestRange.setOverrides).toHaveBeenCalledOnceWith({
          qs: { role: 'MDS' }
        });
      });

      it('should destroy the existing stream', function () {
        expect(streams[0].destroy).toHaveBeenCalledOnce();
      });
    });
  });

  describe('setup', function () {
    var setup, chart, d3, formatter;

    beforeEach(function () {
      formatter = {};

      d3 = {
        format: jasmine.createSpy('format')
          .andReturn(formatter)
      };

      chart = {
        useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
        forceY: jasmine.createSpy('forceY'),
        yAxis: {
          tickFormat: jasmine.createSpy('tickFormat')
        },
        color: jasmine.createSpy('color')
      };

      setup = chartCompiler.mostRecentCall.args[1].options.setup;
      setup(chart, d3);
    });

    it('should use interactive guideline', function () {
      expect(chart.useInteractiveGuideline)
        .toHaveBeenCalledOnceWith(true);
    });

    it('should should force y', function () {
      expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
    });

    it('should set y tick format', function () {
      expect(chart.yAxis.tickFormat)
        .toHaveBeenCalledOnceWith(formatter);
    });

    it('should should create a tick formatter', function () {
      expect(d3.format).toHaveBeenCalledOnceWith('.1%');
    });

    it('should set colors', function () {
      expect(chart.color)
        .toHaveBeenCalledOnceWith(['#F3B600', '#0067B4']);
    });
  });
});
