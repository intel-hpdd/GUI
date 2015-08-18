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


angular.module('spaceUsageModule')
  .factory('getSpaceUsageChart',
  function getSpaceUsageChartFactory (resolveStream, getSpaceUsageStream, DURATIONS, chartPlugins,
                                     chartCompiler, getTimeParams) {
    var DEFAULT_DURATION = [10, DURATIONS.MINUTES];

    return function getSpaceUsageChart (overrides) {
      var requestDuration = getTimeParams
        .getRequestDuration.apply(null, DEFAULT_DURATION);

      requestDuration.setOverrides(overrides);

      return chartCompiler('iml/space-usage/assets/html/space-usage-chart.html', {
        configure: false,
        stream: resolveStream(getSpaceUsageStream(
          requestDuration,
          chartPlugins.bufferDataNewerThan.apply(null, DEFAULT_DURATION)
        )),
        onSubmit: function onSubmit (spaceUsageForm) {
          this.stream.destroy();

          var requestRange, buff;

          if (spaceUsageForm.rangeForm) {
            var start = spaceUsageForm.rangeForm.start.$modelValue;
            var end = spaceUsageForm.rangeForm.end.$modelValue;

            requestRange = getTimeParams.getRequestRange(start, end);
            buff = fp.identity;
          } else if (spaceUsageForm.durationForm) {
            var size = spaceUsageForm.durationForm.size.$modelValue;
            var unit = spaceUsageForm.durationForm.unit.$modelValue;

            requestRange = getTimeParams.getRequestDuration(size, unit);
            buff = chartPlugins
              .bufferDataNewerThan(size, unit);
          }

          requestRange.setOverrides(overrides);

          this.stream = getSpaceUsageStream(requestRange, buff);
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
          setup: function setup (d3Chart, d3) {
            d3Chart.useInteractiveGuideline(true);

            d3Chart.forceY([0, 1]);

            d3Chart.yAxis.tickFormat(d3.format('.1%'));

            d3Chart.xAxis.showMaxMin(false);

            d3Chart.color(['#f05b59']);

            d3Chart.isArea(true);
          }
        },
        size: DEFAULT_DURATION[0],
        unit: DEFAULT_DURATION[1]
      });
    };
  }
);
