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

angular.module('ostBalance')
  .factory('getOstBalanceChart', ['chartCompiler', 'resolveStream', 'getOstBalanceStream', 'getTemplatePromise',
    function getOstBalanceChartFactory (chartCompiler, resolveStream, getOstBalanceStream, getTemplatePromise) {
      'use strict';

      var DEFAULT_PERCENTAGE = 0;

      return function getOstBalanceChart (overrides) {
        var chart = {
          configure: false,
          percentage: DEFAULT_PERCENTAGE,
          stream: resolveStream(getOstBalanceStream(DEFAULT_PERCENTAGE, overrides)),
          tooltipTemplate: getTemplatePromise('iml/ost-balance/assets/html/ost-balance-tooltip.html'),
          onSubmit: function onSubmit () {
            this.stream.destroy();

            this.stream = getOstBalanceStream(this.percentage, overrides);
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
              d3Chart.forceY([0, 1]);

              d3Chart.stacked(true);

              d3Chart.yAxis.tickFormat(d3.format('.1%'));

              d3Chart.showXAxis(false);

              d3Chart.tooltip.contentGenerator(function (d) {
                if (d == null)
                  return '';

                d.data.detail.id = d.data.x;

                return chart.tooltipTemplate.sprintf(d.data.detail);
              });
            }
          }
        };

        return chartCompiler('iml/ost-balance/assets/html/ost-balance.html', chart);
      };
  }]);
