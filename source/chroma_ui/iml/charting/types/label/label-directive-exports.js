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

import angular from 'angular';


export function labelDirective (d3, getLabel) {
  'ngInject';

  return {
    restrict: 'A',
    scope: {
      onData: '=',
      onUpdate: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    link (scope, el, attrs, chartCtrl) {
      const node = el[0];

      const updateLabel = (conf) => {
        const label = getLabel()
          .data(scope.onData);

        scope.onUpdate
          .forEach(fp.invoke(fp.__, [angular.extend({
            label,
            node: d3.select(node)
          }, conf)]));

        conf.svg
          .select(fp.always(node))
          .call(label);
      };

      chartCtrl.onUpdate.push(updateLabel);
    }
  };
}
