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

export function legendDirective (getLegend) {
  'ngInject';

  return {
    restrict: 'A',
    scope: {
      scale: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    link (scope, el, attrs, chartCtrl) {
      const legend = getLegend()
        .colors(scope.scale)
        .showLabels(true);

      const node = el[0];

      const updateLegend = ({svg, width}) => {
        legend
          .width(width)
          .height(20)
          .padding(20);

        svg
          .select(fp.always(node))
          .call(legend);
      };

      chartCtrl.onUpdate.push(updateLegend);

      legend.dispatch().on('selection', (label, shouldHide) => {
        const obj = {};
        obj[label] = shouldHide;
        chartCtrl.dispatch.event('legend', [obj]);
      });
    }
  };
}
