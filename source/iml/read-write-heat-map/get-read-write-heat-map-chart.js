//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
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

import formatNumber from '../number-formatters/format-number.js';
import formatBytes from '../number-formatters/format-bytes.js';

import {__, flow, lensProp, view} from 'intel-fp';
import {values} from 'intel-obj';

// $FlowIgnore: HTML templates that flow does not recognize.
import readWriteHeatMapTemplate from './assets/html/read-write-heat-map';

import type {chartCompilerT} from '../chart-compiler/chart-compiler-module.js';
import type {readWriteHeatMapTypesT} from './read-write-heat-map-module.js';

export function getReadWriteHeatMapChartFactory (createStream, $location, $filter,
                                                 getReadWriteHeatMapStream, DURATIONS, chartCompiler:chartCompilerT,
                                                 readWriteHeatMapTypes:readWriteHeatMapTypesT) {
  'ngInject';

  const DEFAULT_DURATION = [10, DURATIONS.MINUTES];

  const routeSegmentUrl = $filter('routeSegmentUrl');
  const dataLens = view(lensProp('data'));
  const maxMillisecondsDiff = 16000;

  return function getReadWriteHeatMapChart (overrides) {
    var { durationStream, rangeStream } = createStream;
    durationStream = durationStream(__, overrides);
    rangeStream = rangeStream(__, overrides);

    var initStream = durationStream(
      getReadWriteHeatMapStream(readWriteHeatMapTypes.READ_BYTES),
      ...DEFAULT_DURATION
    );

    return chartCompiler(readWriteHeatMapTemplate, initStream, ($scope, stream) => {
      initStream = null;

      const conf = {
        stream,
        modelType: readWriteHeatMapTypes.READ_BYTES,
        type: readWriteHeatMapTypes.READ_BYTES,
        TYPES: values(readWriteHeatMapTypes),
        toReadableType (type) {
          var readable = type
            .split('_')
            .splice(1)
            .join(' ')
            .replace('bytes', 'Byte/s')
            .replace('iops', 'IOPS');

          return readable.charAt(0).toUpperCase() + readable.slice(1);
        },
        onSubmit ({ rangeForm, durationForm }) {
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
          setup (d3Chart) {
            d3Chart.margin({
              left: 70,
              bottom: 50,
              right: 50
            });

            d3Chart.dispatch.on('click', function onClick (points) {
              var sDate = new Date(points.current.ts);
              const eDate = ( points.next ? new Date(points.next.ts) : new Date() );
              const dateDiff = eDate.getTime() - sDate.getTime();

              if (dateDiff < maxMillisecondsDiff) {
                const millisecondsToAdd = maxMillisecondsDiff - dateDiff;
                sDate = new Date(sDate.valueOf() - millisecondsToAdd);
              }

              const startDate = sDate.toISOString();
              const endDate = eDate.toISOString();

              $scope.$apply(function applyLocationChange () {
                $location.path(routeSegmentUrl('app.jobstats', {
                  id: points.current.id,
                  startDate,
                  endDate
                }));
              });
            });
            d3Chart.formatter(getFormatter(conf.type));
            d3Chart.zValue(flow(dataLens, view(lensProp(conf.type))));

            d3Chart.xAxis().ticks(3);
          },
          beforeUpdate: function beforeUpdate (d3Chart) {
            d3Chart.formatter(getFormatter(conf.type));
            d3Chart.zValue(flow(dataLens, view(lensProp(conf.type))));
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
