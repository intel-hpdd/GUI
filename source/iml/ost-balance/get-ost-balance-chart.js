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

// @flow

import flatMapChanges from 'intel-flat-map-changes';

// $FlowIgnore: HTML templates that flow does not recognize.
import ostBalanceTemplate from './assets/html/ost-balance';

import {
  DEFAULT_OST_BALANCE_CHART_ITEMS,
  UPDATE_OST_BALANCE_CHART_ITEMS
} from './ost-balance-chart-reducer.js';

import getOstBalanceStream from './get-ost-balance-stream.js';
import getStore from '../store/get-store.js';
import {
  getConf
} from '../chart-transformers/chart-transformers.js';

import type {
  chartCompilerT
} from '../chart-compiler/chart-compiler-module.js';
import type {
  streamWhenChartVisibleT
} from '../stream-when-visible/stream-when-visible-module.js';
import type {
  localApplyT
} from '../extend-scope-module.js';

export default (chartCompiler:chartCompilerT, streamWhenVisible:streamWhenChartVisibleT,
                localApply:localApplyT) => {
  'ngInject';

  return function getOstBalanceChart (overrides:filesystemQueryT | targetQueryT,
    page:string) {

    getStore.dispatch({ type: DEFAULT_OST_BALANCE_CHART_ITEMS, payload: {
      percentage: 0,
      page
    }});

    const config1$:HighlandStream = getStore.select('ostBalanceCharts');

    const initStream = config1$
      .through(getConf(page))
      .through(flatMapChanges(
        (x:ostBalancePayloadT) => {
          return streamWhenVisible(() => getOstBalanceStream(x.percentage, overrides));
        }
      ));

    return chartCompiler(ostBalanceTemplate, initStream, ($scope:Object,
      stream:HighlandStream<{[page:string]: ostBalancePayloadT}>) => {

      const conf = {
        stream,
        percentage: 0,
        page: '',
        onSubmit (ostBalanceForm:Form) {
          getStore.dispatch({
            type: UPDATE_OST_BALANCE_CHART_ITEMS,
            payload: {
              percentage: ostBalanceForm.percentage.$modelValue,
              page
            }
          });
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

      const config2$:HighlandStreamT<{[page:string]: ostBalancePayloadT}> = getStore.select('ostBalanceCharts');
      config2$
       .through(getConf(page))
       .each((x:ostBalancePayloadT) => {
         Object.assign(conf, x);
         localApply($scope);
       });

      $scope.$on('$destroy', function onDestroy () {
        stream.destroy();
        config1$.destroy();
        config2$.destroy();
      });

      return conf;
    });
  };
};
