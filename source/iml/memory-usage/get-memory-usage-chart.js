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

// $FlowIgnore: HTML templates that flow does not recognize.
import memoryUsageChartTemplate from './assets/html/memory-usage-chart';

export function getMemoryUsageChartFactory (getMemoryUsageStream, createStream,
                                            DURATIONS, chartCompiler, formatBytes) {
  'ngInject';

  const DEFAULT_DURATION = [10, DURATIONS.MINUTES];

  return function getMemoryUsageChart (overrides) {
    const durationStream = createStream.durationStream(getMemoryUsageStream, overrides);
    const rangeStream = createStream.rangeStream(getMemoryUsageStream, overrides);

    return chartCompiler(memoryUsageChartTemplate, durationStream(...DEFAULT_DURATION), ($scope, stream) => {
      const conf = {
        stream,
        size: DEFAULT_DURATION[0],
        unit: DEFAULT_DURATION[1],
        onSubmit ( { rangeForm, durationForm } ) {
          conf.stream.destroy();

          if (rangeForm)
            conf.stream = rangeStream(
              rangeForm.start.$modelValue,
              rangeForm.end.$modelValue
            );
          else if (durationForm)
            conf.stream = durationStream(
              durationForm.size.$modelValue,
              durationForm.unit.$modelValue
            );
        },
        options: {
          setup: function setup (d3Chart) {
            d3Chart.useInteractiveGuideline(true);

            d3Chart.yAxis.tickFormat(function formatNumber (number) {
              if (number === 0) return number;

              return formatBytes(number, 4);
            });

            d3Chart.xAxis.showMaxMin(false);
          }
        }
      };

      $scope.$on('$destroy', function onDestroy () {
        conf.stream.destroy();
      });

      return conf;
    });
  };
}
