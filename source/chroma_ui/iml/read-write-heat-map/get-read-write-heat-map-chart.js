//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.


angular.module('readWriteHeatMap')
  .factory('getReadWriteHeatMapChart',
    function getReadWriteHeatMapChartFactory ($rootScope, $location, $filter, resolveStream,
                                              getReadWriteHeatMapStream, DURATIONS, chartPlugins,
                                 chartCompiler, getTimeParams, readWriteHeatMapTypes, formatNumber, formatBytes) {

      var DEFAULT_DURATION = [10, DURATIONS.MINUTES];

      var routeSegmentUrl = $filter('routeSegmentUrl');

      return function getReadWriteHeatMapChart (overrides) {
        var requestDuration = getTimeParams
          .getRequestDuration.apply(null, DEFAULT_DURATION);

        requestDuration.setOverrides(overrides);

        var chart = {
          configure: false,
          TYPES: _.values(readWriteHeatMapTypes),
          modelType: readWriteHeatMapTypes.READ_BYTES,
          type: readWriteHeatMapTypes.READ_BYTES,
          toReadableType: function toReadableType (type) {
            var readable = type
              .split('_')
              .splice(1)
              .join(' ')
              .replace('bytes', 'Byte/s')
              .replace('iops', 'IOPS');

            return readable.charAt(0).toUpperCase() + readable.slice(1);
          },
          stream: resolveStream(getReadWriteHeatMapStream(
            readWriteHeatMapTypes.READ_BYTES,
            requestDuration,
            chartPlugins.bufferDataNewerThan.apply(null, DEFAULT_DURATION)
          )),
          onSubmit: function onSubmit (readWriteHeatMapForm) {
            this.stream.destroy();

            var requestRange, buff;

            if (readWriteHeatMapForm.rangeForm) {
              var start = readWriteHeatMapForm.rangeForm.start.$modelValue;
              var end = readWriteHeatMapForm.rangeForm.end.$modelValue;

              requestRange = getTimeParams.getRequestRange(start, end);
              buff = fp.identity;
            } else if (readWriteHeatMapForm.durationForm) {
              var size = readWriteHeatMapForm.durationForm.size.$modelValue;
              var unit = readWriteHeatMapForm.durationForm.unit.$modelValue;

              requestRange = getTimeParams.getRequestDuration(size, unit);
              buff = chartPlugins
                .bufferDataNewerThan(size, unit);
            }

            requestRange.setOverrides(overrides);

            this.type = this.modelType;
            this.stream = getReadWriteHeatMapStream(this.type, requestRange, buff);
            this.onCancel();
          },
          onCancel: function onCancel () {
            this.configure = false;
          },
          onConfigure: function onConfigure () {
            this.configure = true;
          },
          onDestroy: function onDestroy () {
            this.stream.destroy();
          },
          options: {
            setup: function setup (d3Chart) {
              d3Chart.margin({
                left: 70,
                bottom: 50,
                right: 50
              });

              d3Chart.dispatch.on('click', function (points) {
                var start = new Date(points.current.ts).toISOString();
                var end = ( points.next ? new Date(points.next.ts).toISOString() : new Date().toISOString() );

                $rootScope.$apply(function applyLocationChange () {
                  $location.path(routeSegmentUrl('app.jobstats', {
                    id: points.current.id,
                    startDate: start,
                    endDate: end
                  }));
                });
              });
              d3Chart.formatter(getFormatter(chart.type));
              d3Chart.zValue(_.pluckPath('data.' + chart.type));

              d3Chart.xAxis().ticks(3);
            },
            beforeUpdate: function beforeUpdate (d3Chart) {
              d3Chart.formatter(getFormatter(chart.type));
              d3Chart.zValue(_.pluckPath('data.' + chart.type));
              d3Chart.xAxisDetail(chart.toReadableType(chart.type));
            }
          },
          size: DEFAULT_DURATION[0],
          unit: DEFAULT_DURATION[1]
        };

        return chartCompiler('iml/read-write-heat-map/assets/html/read-write-heat-map.html', chart);
      };

      function getFormatter (type) {
        var dataType = type.split('_').pop();

        if (dataType === 'bytes')
          return function (z) {
            return formatBytes(z, 3) + '/s';
          };
        else if (dataType === 'iops')
          return function (z) {
            return formatNumber(z, 2, true) + ' IOPS';
          };
      }
    }
  );
