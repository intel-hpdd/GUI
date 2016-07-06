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
import ostBalanceTemplate from './assets/html/ost-balance';
import getOstBalanceStream from './get-ost-balance-stream.js';

import type {chartCompilerT} from '../chart-compiler/chart-compiler-module.js';
import type {streamWhenChartVisibleT} from '../stream-when-visible/stream-when-visible-module.js';

export default (chartCompiler:chartCompilerT, streamWhenVisible:streamWhenChartVisibleT) => {
  'ngInject';

  const DEFAULT_PERCENTAGE = 0;

  return function getOstBalanceChart (overrides) {
    const stream = streamWhenVisible(() => getOstBalanceStream(overrides, DEFAULT_PERCENTAGE));

    return chartCompiler(ostBalanceTemplate, stream, ($scope, stream) => {
      const conf = {
        percentage: DEFAULT_PERCENTAGE,
        stream,
        onSubmit () {
          conf.stream.destroy();
          conf.stream = streamWhenVisible(() => getOstBalanceStream(overrides, conf.percentage));
        },
        options: {
          setup (d3Chart, d3) {
            d3Chart.forceY([0, 1]);

            d3Chart.stacked(true);

            d3Chart.yAxis.tickFormat(d3.format('.1%'));

            d3Chart.showXAxis(false);

            d3Chart.tooltip.contentGenerator((d) => {
              if (d == null)
                return '';

              const detail = d.data.detail;
              detail.id = d.data.x;

              return `<table>
                <thead>
                  <tr>
                    <td>
                      <strong class="x-value">${detail.id}</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="key">Free</td>
                    <td class="value">${detail.bytesFree} (${detail.percentFree}%)</td>
                  </tr>
                  <tr>
                    <td class="key">Used</td>
                    <td class="value">${detail.bytesUsed} (${detail.percentUsed}%)</td>
                  </tr>
                  <tr>
                    <td class="key">Capacity</td>
                    <td class="value">${detail.bytesTotal}</td>
                  </tr>
                </tbody>
              </table>`;
            });
          }
        }
      };

      $scope.$on('$destroy', function onDestroy () {
        conf.stream.destroy();
      });

      return conf;
    });
  };
};
