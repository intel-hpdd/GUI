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

import {
  identity,
  always
} from 'intel-fp';
import flatMapChanges from 'intel-flat-map-changes';

// $FlowIgnore: HTML templates that flow does not recognize.
import mdoTemplate from './assets/html/mdo';

import {
  DEFAULT_MDO_CHART_ITEMS,
  UPDATE_MDO_CHART_ITEMS
} from './mdo-chart-reducer.js';

import getMdoStream from './get-mdo-stream.js';
import formatNumber from '../number-formatters/format-number.js';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';

import {
  getConf
} from '../chart-transformers/chart-transformers.js';

import type {
  chartCompilerT
} from '../chart-compiler/chart-compiler-module.js';
import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type {
  localApplyT
} from '../extend-scope-module.js';
import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';
import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

export default (chartCompiler:chartCompilerT,
                localApply:localApplyT, data$Fn:data$FnT) => {
  'ngInject';

  return function getMdoChart (overrides:filesystemQueryT | targetQueryT, page:string) {
    getStore.dispatch({
      type: DEFAULT_MDO_CHART_ITEMS,
      payload: durationPayload({page})
    });

    const config1$ = getStore.select('mdoCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges(
          data$Fn(overrides, always(getMdoStream))
        )
      );

    return chartCompiler(mdoTemplate, initStream, ($scope, stream) => {
      const conf = {
        stream,
        configType: '',
        page: '',
        startDate: '',
        endDate: '',
        size: 1,
        unit:'',
        onSubmit: durationSubmitHandler(UPDATE_MDO_CHART_ITEMS, {page}),
        options: {
          setup (chart) {
            chart.useInteractiveGuideline(true);

            chart.interactiveLayer.tooltip
              .headerFormatter(identity);

            chart.yAxis.tickFormat((d) => formatNumber(d, 2, true));

            chart.forceY([0, 1]);

            chart.xAxis.showMaxMin(false);
          }
        }
      };

      const config2$ = getStore.select('mdoCharts');
      config2$
        .through(getConf(page))
        .each((x:durationPayloadT) => {
          Object.assign(conf, x);
          localApply($scope);
        });

      $scope.$on('$destroy', () => {
        stream.destroy();
        config1$.destroy();
        config2$.destroy();
      });

      return conf;
    });
  };
};
