describe('the file usage chart', function () {
  'use strict';

  var chartCompiler, resolveStream, getFileUsageStream, fileUsageStream,
    getTimeParams, buff, requestDuration,
    requestRange, chartPlugins, streams, chart;

  beforeEach(module('fileUsageModule', function ($provide) {
    resolveStream = jasmine
      .createSpy('resolveStream')
      .andCallFake(_.identity);

    $provide.value('resolveStream', resolveStream);

    streams = [];

    getFileUsageStream = jasmine.createSpy('getFileUsageStream')
      .andCallFake(function () {
        fileUsageStream = highland();
        spyOn(fileUsageStream, 'destroy');
        streams.push(fileUsageStream);
        return fileUsageStream;
      });

    $provide.value('getFileUsageStream', getFileUsageStream);

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

  var fileUsageChart, getFileUsageChart, DURATIONS;

  beforeEach(inject(function (_getFileUsageChart_, _DURATIONS_) {
    DURATIONS = _DURATIONS_;

    getFileUsageChart = _getFileUsageChart_;
    fileUsageChart = getFileUsageChart('foo', 'bar', {
      qs: {
        host_id: '1'
      }
    });

    chart = chartCompiler.mostRecentCall.args[1];
  }));

  it('should return a factory function', function () {
    expect(getFileUsageChart).toEqual(jasmine.any(Function));
  });

  it('should setup the chart', function () {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith('iml/file-usage/assets/html/file-usage-chart.html', {
        title: 'foo',
        configure: false,
        stream: fileUsageStream,
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

    expect(fileUsageStream.destroy).toHaveBeenCalledOnce();
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
        expect(getFileUsageStream)
          .toHaveBeenCalledTwiceWith('bar', requestDuration, buff);
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
        expect(getFileUsageStream)
          .toHaveBeenCalledOnceWith('bar', requestRange, jasmine.any(Function));
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
    var setup, chart, formatter;

    beforeEach(function () {
      formatter = {};

      var d3 = {
        format: jasmine.createSpy('format')
          .andReturn(formatter)
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

      setup = chartCompiler.mostRecentCall.args[1].options.setup;
      setup(chart, d3);
    });

    it('should use interactive guideline', function () {
      expect(chart.useInteractiveGuideline)
        .toHaveBeenCalledOnceWith(true);
    });

    it('should forceY', function () {
      expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
    });

    it('should set y tick format', function () {
      expect(chart.yAxis.tickFormat)
        .toHaveBeenCalledOnceWith(formatter);
    });

    it('should not show max and min on the x axis', function () {
      expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
    });

    it('should set a color', function () {
      expect(chart.color).toHaveBeenCalledOnceWith(['#f05b59']);
    });

    it('should set the chart to area', function () {
      expect(chart.isArea).toHaveBeenCalledOnceWith(true);
    });
  });
});
