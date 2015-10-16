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

export function getReadWriteHeatMapChartFactory (createStream, $location, $filter,
                                                 getReadWriteHeatMapStream, DURATIONS, chartCompiler,
                                                 readWriteHeatMapTypes, formatNumber, formatBytes) {
  'ngInject';

  const DEFAULT_DURATION = [10, DURATIONS.MINUTES];

  const routeSegmentUrl = $filter('routeSegmentUrl');
  const dataLens = fp.lensProp('data');

  return function getReadWriteHeatMapChart (overrides) {
    var { durationStream, rangeStream } = createStream;
    durationStream = durationStream(fp.__, overrides);
    rangeStream = rangeStream(fp.__, overrides);

    const template = 'iml/read-write-heat-map/assets/html/read-write-heat-map.html';
    var initStream = durationStream(
      getReadWriteHeatMapStream(readWriteHeatMapTypes.READ_BYTES),
      ...DEFAULT_DURATION
    );

    return chartCompiler(template, initStream, ($scope, stream) => {
      initStream = null;

      const conf = {
        stream,
        modelType: readWriteHeatMapTypes.READ_BYTES,
        type: readWriteHeatMapTypes.READ_BYTES,
        TYPES: obj.values(readWriteHeatMapTypes),
        toReadableType(type) {
          var readable = type
            .split('_')
            .splice(1)
            .join(' ')
            .replace('bytes', 'Byte/s')
            .replace('iops', 'IOPS');

          return readable.charAt(0).toUpperCase() + readable.slice(1);
        },
        onSubmit({ rangeForm, durationForm }) {
          conf.stream.destroy();
          conf.type = conf.modelType;

          if (rangeForm)
            conf.stream = rangeStream(
              getReadWriteHeatMapStream(conf.type),
              rangeForm.start.$modelValue,
              rangeForm.end.$modelValue
            );
          else if (durationForm)
            conf.stream = durationStream(
              getReadWriteHeatMapStream(conf.type),
              durationForm.size.$modelValue,
              durationForm.unit.$modelValue
            );
        },
        options: {
          setup(d3Chart) {
            d3Chart.margin({
              left: 70,
              bottom: 50,
              right: 50
            });

            d3Chart.dispatch.on('click', function onClick (points) {
              const startDate = new Date(points.current.ts).toISOString();
              const endDate = ( points.next ? new Date(points.next.ts).toISOString() : new Date().toISOString() );

              $scope.$apply(function applyLocationChange () {
                $location.path(routeSegmentUrl('app.jobstats', {
                  id: points.current.id,
                  startDate,
                  endDate
                }));
              });
            });
            d3Chart.formatter(getFormatter(conf.type));
            d3Chart.zValue(fp.flow(dataLens, fp.lensProp(conf.type)));

            d3Chart.xAxis().ticks(3);
          },
          beforeUpdate: function beforeUpdate (d3Chart) {
            d3Chart.formatter(getFormatter(conf.type));
            d3Chart.zValue(fp.flow(dataLens, fp.lensProp(conf.type)));
            d3Chart.xAxisDetail(conf.toReadableType(conf.type));
          }
        },
        size: DEFAULT_DURATION[0],
        unit: DEFAULT_DURATION[1]
      };

      $scope.$on('$destroy', function onDestroy () {
        conf.stream.destroy();
      });

      return conf;
    });
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
