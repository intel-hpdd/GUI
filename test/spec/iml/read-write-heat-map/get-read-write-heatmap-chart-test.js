describe('the read write heat map chart', function () {
  'use strict';

  var chartCompiler, chartPlugins, compiled, s,
    resolveStream, formatNumber, formatBytes,
    getReadWriteHeatMapStream, getTimeParams,
    requestDuration, requestRange, buff, $filter, routeSegmentUrl;

  var types = ['stats_read_bytes', 'stats_write_bytes', 'stats_read_iops', 'stats_write_iops'];

  beforeEach(module('readWriteHeatMap', function ($provide) {
    compiled = {};

    chartCompiler = jasmine.createSpy('chartCompiler')
      .andReturn(compiled);

    $provide.value('chartCompiler', chartCompiler);

    s = highland();
    spyOn(s, 'destroy').andCallThrough();

    getReadWriteHeatMapStream = jasmine.createSpy('getReadWriteHeatMapStream')
      .andReturn(s);

    $provide.value('getReadWriteHeatMapStream', getReadWriteHeatMapStream);

    resolveStream = jasmine.createSpy('resolveStream')
      .andCallFake(_.identity);

    $provide.value('resolveStream', resolveStream);

    buff = {};

    chartPlugins = {
      bufferDataNewerThan: jasmine.createSpy('bufferDataNewerThan')
        .andReturn(buff)
    };
    $provide.value('chartPlugins', chartPlugins);

    requestDuration = {
      setOverrides: jasmine.createSpy('getRequestDuration')
    };
    requestRange = {
      setOverrides: jasmine.createSpy('getRequestDuration')
    };

    getTimeParams = {
      getRequestDuration: jasmine.createSpy('getRequestDuration')
        .andReturn(requestDuration),
      getRequestRange: jasmine.createSpy('getRequestRange')
        .andReturn(requestRange)
    };
    $provide.value('getTimeParams', getTimeParams);

    formatNumber = jasmine.createSpy('formatNumber')
      .andCallFake(_.identity);

    $provide.value('formatNumber', formatNumber);

    formatBytes = jasmine.createSpy('formatBytes')
      .andCallFake(_.identity);

    $provide.value('formatBytes', formatBytes);

    routeSegmentUrl = jasmine.createSpy('routeSegmentUrl');

    $filter = jasmine.createSpy('$filter')
      .andReturn(routeSegmentUrl);

    $provide.value('$filter', $filter);

  }));

  var getReadWriteHeatMapChart, readWriteHeatMapChart, config;

  beforeEach(inject(function (_getReadWriteHeatMapChart_) {
    getReadWriteHeatMapChart = _getReadWriteHeatMapChart_;
    readWriteHeatMapChart = getReadWriteHeatMapChart();
    config = chartCompiler.mostRecentCall.args[1];
  }));

  it('should be a function', function () {
    expect(getReadWriteHeatMapChart).toEqual(jasmine.any(Function));
  });

  it('should request the routeSegmentUrl filter', function () {
    expect($filter).toHaveBeenCalledOnceWith('routeSegmentUrl');
  });

  it('should compile a chart', function () {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith('iml/read-write-heat-map/assets/html/read-write-heat-map.html', {
        configure: false,
        TYPES: ['stats_read_bytes', 'stats_write_bytes', 'stats_read_iops', 'stats_write_iops'],
        modelType: 'stats_read_bytes',
        type: 'stats_read_bytes',
        toReadableType: jasmine.any(Function),
        stream: s,
        onSubmit: jasmine.any(Function),
        onCancel: jasmine.any(Function),
        onConfigure: jasmine.any(Function),
        onDestroy: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function),
          beforeUpdate: jasmine.any(Function)
        },
        size: 10,
        unit: 'minutes'
      });
  });

  it('should destroy the stream on destroy', function () {
    config.onDestroy();

    expect(s.destroy).toHaveBeenCalledOnce();
  });

  it('should return the compiledChart', function () {
    expect(readWriteHeatMapChart).toEqual(compiled);
  });

  _.zip(types, ['Read Byte/s', 'Write Byte/s', 'Read IOPS', 'Write IOPS'])
    .forEach(function (pair) {
      it('readable type should convert' + pair[0] + ' to ' + pair[1], function () {
        expect(config.toReadableType(pair[0]))
          .toEqual(pair[1]);
      });
    });

  it('should create an initial stream with expected data', function () {
    expect(getReadWriteHeatMapStream).toHaveBeenCalledOnceWith(
      'stats_read_bytes',
      requestDuration,
      buff
    );
  });

  it('should set configure to false on cancel', function () {
    config.configure = true;
    config.onCancel();
    expect(config.configure).toBe(false);
  });

  it('should set configure to true on configure', function () {
    config.configure = false;
    config.onConfigure();
    expect(config.configure).toBe(true);
  });

  describe('submitting a range', function () {
    beforeEach(function () {
      var form = {
        rangeForm: {
          start: { $modelValue: 5 },
          end: { $modelValue: 6 }
        }
      };

      config.modelType = 'stats_write_bytes';

      config.onSubmit(form);
    });

    it('should destroy the existing stream on submit', function () {
      expect(s.destroy).toHaveBeenCalledOnce();
    });

    it('should get a request range', function () {
      expect(getTimeParams.getRequestRange)
        .toHaveBeenCalledOnceWith(5, 6);
    });

    it('should create a stream with the new data', function () {
      expect(getReadWriteHeatMapStream)
        .toHaveBeenCalledOnceWith(
          'stats_write_bytes',
          requestRange,
          jasmine.any(Function)
      );
    });
  });

  describe('submitting a duration', function () {
    beforeEach(function () {
      var form = {
        durationForm: {
          size: { $modelValue: 5 },
          unit: { $modelValue: 'hours' }
        }
      };

      config.modelType = 'stats_read_iops';

      config.onSubmit(form);
    });

    it('should destroy the existing stream on submit', function () {
      expect(s.destroy).toHaveBeenCalledOnce();
    });

    it('should get a request duration', function () {
      expect(getTimeParams.getRequestDuration)
        .toHaveBeenCalledOnceWith(5, 'hours');
    });

    it('should get a new buffer', function () {
      expect(chartPlugins.bufferDataNewerThan)
        .toHaveBeenCalledOnceWith(5, 'hours');
    });

    it('should create a stream with the new data', function () {
      expect(getReadWriteHeatMapStream)
        .toHaveBeenCalledOnceWith(
        'stats_read_iops',
        requestDuration,
        buff
      );
    });
  });

  describe('options', function () {
    var d3Chart;

    beforeEach(function () {
      d3Chart = {
        margin: jasmine.createSpy('margin'),
        formatter: jasmine.createSpy('formatter'),
        zValue: jasmine.createSpy('zValue'),
        xAxis: jasmine.createSpy('xAxis')
          .andReturn({
            ticks: jasmine.createSpy('ticks')
          }),
        xAxisLabel: jasmine.createSpy('xAxisLabel'),
        xAxisDetail: jasmine.createSpy('xAxisDetail'),
        dispatch: {
          on: jasmine.createSpy('on')
        }
      };
    });

    describe('on setup', function () {
      beforeEach(function () {
        config.options.setup(d3Chart);
      });

      it('should setup the margin', function () {
        expect(d3Chart.margin)
          .toHaveBeenCalledOnceWith({
            left: 70,
            bottom: 50,
            right: 50
          });
      });

      it('should setup a formatter', function () {
        expect(d3Chart.formatter)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should setup the z value', function () {
        expect(d3Chart.zValue)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should set x axis ticks to 3', function () {
        expect(d3Chart.xAxis.plan().ticks)
          .toHaveBeenCalledOnceWith(3);
      });

      it('should setup a click handler', function () {
        expect(d3Chart.dispatch.on).toHaveBeenCalledOnceWith('click', jasmine.any(Function));
      });
    });

    describe('before updating', function () {
      beforeEach(function () {
        config.options.beforeUpdate(d3Chart);
      });

      it('should setup a formatter', function () {
        expect(d3Chart.formatter)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should setup the z value', function () {
        expect(d3Chart.zValue)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should set x axis detail', function () {
        expect(d3Chart.xAxisDetail)
          .toHaveBeenCalledOnceWith('Read Byte/s');
      });
    });
  });
});
