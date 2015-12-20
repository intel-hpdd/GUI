import angular from 'angular';
const {inject} = angular.mock;

import {getReadWriteHeatMapChartFactory}
  from '../../../../source/chroma_ui/iml/read-write-heat-map/get-read-write-heat-map-chart-exports';

describe('read write heat map chart', () => {
  var $location, $filter, chartCompiler, compiled,
    resolveStream, formatNumber, formatBytes, DURATIONS,
    getReadWriteHeatMapStream, durationStream, rangeStream, createStream,
    routeSegmentUrl, readWriteHeatMapTypes,
    getReadWriteHeatMapChart, readWriteHeatMapStream, readWriteHeatMapChart;

  var types = ['stats_read_bytes', 'stats_write_bytes', 'stats_read_iops', 'stats_write_iops'];

  beforeEach(() => {
    compiled = {};

    chartCompiler = jasmine.createSpy('chartCompiler')
      .andReturn(compiled);

    readWriteHeatMapTypes = {
      READ_BYTES: 'stats_read_bytes',
      WRITE_BYTES: 'stats_write_bytes',
      READ_IOPS: 'stats_read_iops',
      WRITE_IOPS: 'stats_write_iops'
    };

    readWriteHeatMapStream = {};
    getReadWriteHeatMapStream = jasmine.createSpy('getReadWriteHeatMapStream')
      .andReturn(readWriteHeatMapStream);

    resolveStream = jasmine.createSpy('resolveStream')
      .andCallFake(fp.identity);

    durationStream = jasmine.createSpy('durationStream')
      .andCallFake(() => highland());

    rangeStream = jasmine.createSpy('rangeStream')
      .andCallFake(() => highland());

    formatNumber = jasmine.createSpy('formatNumber')
      .andCallFake(fp.identity);

    formatBytes = jasmine.createSpy('formatBytes')
      .andCallFake(fp.identity);

    routeSegmentUrl = jasmine.createSpy('routeSegmentUrl');

    $filter = jasmine.createSpy('$filter')
      .andReturn(routeSegmentUrl);

    createStream = {
      durationStream: fp.curry(4, durationStream),
      rangeStream: fp.curry(4, rangeStream)
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
        'iml/read-write-heat-map/assets/html/read-write-heat-map.html',
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
      handler = chartCompiler.mostRecentCall.args[2];

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
        TYPES: obj.values(readWriteHeatMapTypes),
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
      var d3Chart;

      beforeEach(() => {
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
          expect(d3Chart.xAxis.plan().ticks)
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
