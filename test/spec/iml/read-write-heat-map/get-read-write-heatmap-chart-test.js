import highland from 'highland';
import {identity, curry} from 'intel-fp';
import {values} from 'intel-obj';
import {getReadWriteHeatMapChartFactory}
  from '../../../../source/iml/read-write-heat-map/get-read-write-heat-map-chart';

describe('read write heat map chart', () => {
  var $location, $filter, chartCompiler, compiled,
    formatNumber, formatBytes, DURATIONS,
    getReadWriteHeatMapStream, durationStream, rangeStream, createStream,
    routeSegmentUrl, readWriteHeatMapTypes,
    getReadWriteHeatMapChart, readWriteHeatMapStream, readWriteHeatMapChart;

  var types = ['stats_read_bytes', 'stats_write_bytes', 'stats_read_iops', 'stats_write_iops'];

  beforeEach(() => {
    compiled = {};

    chartCompiler = jasmine.createSpy('chartCompiler')
      .and.returnValue(compiled);

    readWriteHeatMapTypes = {
      READ_BYTES: 'stats_read_bytes',
      WRITE_BYTES: 'stats_write_bytes',
      READ_IOPS: 'stats_read_iops',
      WRITE_IOPS: 'stats_write_iops'
    };

    readWriteHeatMapStream = {};
    getReadWriteHeatMapStream = jasmine.createSpy('getReadWriteHeatMapStream')
      .and.returnValue(readWriteHeatMapStream);

    durationStream = jasmine.createSpy('durationStream')
      .and.callFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .and.callFake(() => highland());

    formatNumber = jasmine.createSpy('formatNumber')
      .and.callFake(identity);

    formatBytes = jasmine.createSpy('formatBytes')
      .and.callFake(identity);

    routeSegmentUrl = jasmine.createSpy('routeSegmentUrl');

    $filter = jasmine.createSpy('$filter')
      .and.returnValue(routeSegmentUrl);

    createStream = {
      durationStream: curry(4, durationStream),
      rangeStream: curry(4, rangeStream)
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    DURATIONS = {
      MINUTES: 'minutes'
    };

    getReadWriteHeatMapChart = getReadWriteHeatMapChartFactory(createStream, $location, $filter,
      getReadWriteHeatMapStream, DURATIONS, chartCompiler,
      readWriteHeatMapTypes, formatNumber, formatBytes);
    readWriteHeatMapChart = getReadWriteHeatMapChart({
      qs: {
        host_id: '1'
      }
    });
  });

  it('should be a function', () => {
    expect(getReadWriteHeatMapChart).toEqual(jasmine.any(Function));
  });

  it('should request the routeSegmentUrl filter', () => {
    expect($filter).toHaveBeenCalledOnceWith('routeSegmentUrl');
  });

  it('should compile a chart', () => {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith(
        '/static/chroma_ui/source/iml/read-write-heat-map/assets/html/read-write-heat-map.js',
        jasmine.any(Object),
        jasmine.any(Function)
      );
  });

  it('should return the compiledChart', () => {
    expect(readWriteHeatMapChart).toEqual(compiled);
  });

  it('should call durationStream', () => {
    expect(durationStream).toHaveBeenCalledOnceWith(readWriteHeatMapStream, {
      qs: {
        host_id: '1'
      }
    }, 10, 'minutes');
  });

  it('should create an initial stream with expected data', () => {
    expect(getReadWriteHeatMapStream)
      .toHaveBeenCalledOnceWith(readWriteHeatMapTypes.READ_BYTES);
  });

  describe('setup chart', () => {
    var handler, $scope, stream,
      chart;

    beforeEach(inject(($rootScope) => {
      handler = chartCompiler.calls.mostRecent().args[2];

      stream = highland();
      spyOn(stream, 'destroy');
      $scope = $rootScope.$new();

      chart = handler($scope, stream);
    }));

    it('should return a config', () => {
      expect(chart).toEqual({
        stream,
        modelType: readWriteHeatMapTypes.READ_BYTES,
        type: readWriteHeatMapTypes.READ_BYTES,
        TYPES: values(readWriteHeatMapTypes),
        toReadableType: jasmine.any(Function),
        onSubmit: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function),
          beforeUpdate: jasmine.any(Function)
        },
        size: 10,
        unit: 'minutes'
      });
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(stream.destroy).toHaveBeenCalledOnce();
    });

    const humanReadable = ['Read Byte/s', 'Write Byte/s', 'Read IOPS', 'Write IOPS'];
    types.forEach((type, idx) => {
      it('readable type should convert' + type + ' to ' + humanReadable[idx], () => {
        expect(chart.toReadableType(type))
          .toEqual(humanReadable[idx]);
      });
    });

    describe('on submit', () => {
      describe('with a duration', () => {
        beforeEach(() => {
          chart.modelType = readWriteHeatMapTypes.READ_IOPS;

          chart.onSubmit({
            durationForm: {
              size: { $modelValue: 5 },
              unit: { $modelValue: 'hours' }
            }
          });
        });

        it('should call getReadWriteHeatMapStream', () => {
          expect(getReadWriteHeatMapStream)
            .toHaveBeenCalledOnceWith(readWriteHeatMapTypes.READ_IOPS);
        });

        it('should create a duration stream', () => {
          expect(durationStream).toHaveBeenCalledOnceWith(readWriteHeatMapStream, {
            qs: {
              host_id: '1'
            }
          }, 5, 'hours');
        });
      });

      describe('with a range', () => {
        beforeEach(() => {
          chart.modelType = readWriteHeatMapTypes.WRITE_BYTES;

          chart.onSubmit({
            start: { $modelValue: '2015-05-03T07:25' },
            end: { $modelValue: '2015-05-03T07:35' }
          });

          it('should call getReadWriteHeatMapStream', () => {
            expect(getReadWriteHeatMapStream)
              .toHaveBeenCalledOnceWith(readWriteHeatMapTypes.WRITE_BYTES);
          });

          it('should create a range stream', () => {
            expect(rangeStream).toHaveBeenCalledOnceWith(readWriteHeatMapStream, {
              qs: {
                host_id: '1'
              }
            }, '2015-05-03T07:25', '2015-05-03T07:35');
          });
        });
      });
    });

    describe('options', () => {
      var d3Chart, axisInstance;

      beforeEach(() => {
        axisInstance = {
          ticks: jasmine.createSpy('ticks')
        };

        d3Chart = {
          margin: jasmine.createSpy('margin'),
          formatter: jasmine.createSpy('formatter'),
          zValue: jasmine.createSpy('zValue'),
          xAxis: jasmine.createSpy('xAxis')
            .and.returnValue(axisInstance),
          xAxisLabel: jasmine.createSpy('xAxisLabel'),
          xAxisDetail: jasmine.createSpy('xAxisDetail'),
          dispatch: {
            on: jasmine.createSpy('on')
          }
        };
      });

      describe('on setup', () => {
        beforeEach(() => {
          chart.options.setup(d3Chart);
        });

        it('should setup the margin', () => {
          expect(d3Chart.margin)
            .toHaveBeenCalledOnceWith({
              left: 70,
              bottom: 50,
              right: 50
            });
        });

        it('should setup a formatter', () => {
          expect(d3Chart.formatter)
            .toHaveBeenCalledOnceWith(jasmine.any(Function));
        });

        it('should setup the z value', () => {
          expect(d3Chart.zValue)
            .toHaveBeenCalledOnceWith(jasmine.any(Function));
        });

        it('should set x axis ticks to 3', () => {
          expect(axisInstance.ticks)
            .toHaveBeenCalledOnceWith(3);
        });

        it('should setup a click handler', () => {
          expect(d3Chart.dispatch.on)
            .toHaveBeenCalledOnceWith('click', jasmine.any(Function));
        });
      });

      describe('before updating', () => {
        beforeEach(() => {
          chart.options.beforeUpdate(d3Chart);
        });

        it('should setup a formatter', () => {
          expect(d3Chart.formatter)
            .toHaveBeenCalledOnceWith(jasmine.any(Function));
        });

        it('should setup the z value', () => {
          expect(d3Chart.zValue)
            .toHaveBeenCalledOnceWith(jasmine.any(Function));
        });

        it('should set x axis detail', () => {
          expect(d3Chart.xAxisDetail)
            .toHaveBeenCalledOnceWith('Read Byte/s');
        });
      });
    });
  });
});
