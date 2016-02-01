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

import {flow, invokeMethod, always} from 'intel-fp';

export function lineDirective (getLine) {
  'ngInject';

  return {
    restrict: 'A',
    scope: {
      color: '=',
      scaleX: '=',
      scaleY: '=',
      valueX: '=',
      valueY: '=',
      comparatorX: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    link (scope, el, attrs, chartCtrl) {
      const node = el[0];
      const line = getLine();

      const callLine = flow(
        invokeMethod('select', [always(node)]),
        invokeMethod('call', [line])
      );

      chartCtrl.dispatch.on(`event.line${line.getCount()}`, (type, args) => {
        if (type !== 'legend')
          return;

        const shouldHide = scope.valueY(args[0]);

        if (shouldHide == null)
          return;

        line
          .opacity(shouldHide ? 0 : 1);

        callLine(chartCtrl.svg);
      });

      const updateLine = ({svg}) => {
        line
          .color(scope.color)
          .xScale(scope.scaleX)
          .yScale(scope.scaleY)
          .xValue(scope.valueX)
          .xComparator(scope.comparatorX)
          .yValue(scope.valueY);

        callLine(svg);
      };

      chartCtrl.onUpdate.push(updateLine);
    }
  };
}
