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

import {identity} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import mdoTemplate from './assets/html/mdo';

import type {getMdoStreamT} from './mdo-module.js';
import type {chartCompilerT} from '../chart-compiler/chart-compiler-module.js';

export function getMdoChartFactory (createStream, getMdoStream:getMdoStreamT, DURATIONS,
                               chartCompiler:chartCompilerT) {
  'ngInject';

  const DEFAULT_DURATION = [10, DURATIONS.MINUTES];

  return function getMdoChart (overrides) {
    const durationStream = createStream.durationStream(getMdoStream, overrides);
    const rangeStream = createStream.rangeStream(getMdoStream, overrides);

    return chartCompiler(mdoTemplate, durationStream(...DEFAULT_DURATION), ($scope, stream) => {
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

      $scope.$on('$destroy', () => {
        conf.stream.destroy();
      });

      return conf;
    });
  };
}
