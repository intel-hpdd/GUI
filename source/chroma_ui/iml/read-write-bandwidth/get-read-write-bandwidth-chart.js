//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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


angular.module('readWriteBandwidth')
  .factory('getReadWriteBandwidthChart',
    function getReadWriteBandwidthChartFactory (resolveStream, getReadWriteBandwidthStream, DURATIONS, chartPlugins,
                                 chartCompiler, getTimeParams, formatBytes) {

      var DEFAULT_DURATION = [10, DURATIONS.MINUTES];

      return function getReadWriteBandwidthChart (overrides) {
        var requestDuration = getTimeParams
          .getRequestDuration.apply(null, DEFAULT_DURATION);

        requestDuration.setOverrides(overrides);

        return chartCompiler('iml/read-write-bandwidth/assets/html/read-write-bandwidth.html', {
          configure: false,
          stream: resolveStream(getReadWriteBandwidthStream(
            requestDuration,
            chartPlugins.bufferDataNewerThan.apply(null, DEFAULT_DURATION)
          )),
          onSubmit: function onSubmit (readWriteBandwidthForm) {
            this.stream.destroy();

            var requestRange, buff;

            if (readWriteBandwidthForm.rangeForm) {
              var start = readWriteBandwidthForm.rangeForm.start.$modelValue;
              var end = readWriteBandwidthForm.rangeForm.end.$modelValue;

              requestRange = getTimeParams.getRequestRange(start, end);
              buff = fp.identity;
            } else if (readWriteBandwidthForm.durationForm) {
              var size = readWriteBandwidthForm.durationForm.size.$modelValue;
              var unit = readWriteBandwidthForm.durationForm.unit.$modelValue;

              requestRange = getTimeParams.getRequestDuration(size, unit);
              buff = chartPlugins
                .bufferDataNewerThan(size, unit);
            }

            requestRange.setOverrides(overrides);

            this.stream = getReadWriteBandwidthStream(requestRange, buff);
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
        });
      };
    }
  );
