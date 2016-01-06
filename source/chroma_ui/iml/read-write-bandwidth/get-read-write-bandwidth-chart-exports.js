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

export function getReadWriteBandwidthChartFactory (createStream, getReadWriteBandwidthStream, DURATIONS,
                                                   chartCompiler, formatBytes) {
  'ngInject';

  var DEFAULT_DURATION = [10, DURATIONS.MINUTES];

  return function getReadWriteBandwidthChart (overrides) {
    const durationStream = createStream.durationStream(getReadWriteBandwidthStream, overrides);
    const rangeStream = createStream.rangeStream(getReadWriteBandwidthStream, overrides);

    const template = 'iml/read-write-bandwidth/assets/html/read-write-bandwidth.html';

    return chartCompiler(template, durationStream(...DEFAULT_DURATION), ($scope, stream) => {
      const conf = {
        stream,
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

            d3Chart.yAxis.tickFormat(function (number) {
              if (number === 0) return number;

              return formatBytes(Math.abs(number), 3) + '/s';
            });

            d3Chart.color(['#0067B4', '#E17200']);

            d3Chart.isArea(true);

            d3Chart.xAxis.showMaxMin(false);
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
}
