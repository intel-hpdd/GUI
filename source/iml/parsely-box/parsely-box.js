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

import {noop} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import parselyBoxTemplate from './assets/html/parsely-box.html!text';

export function parselyBox () {
  'ngInject';

  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      onSubmit: '&',
      completer: '&',
      parserFormatter: '=',
      query: '=?'
    },
    controllerAs: 'ctrl',
    controller: noop,
    template: parselyBoxTemplate
  };
}

export function parseQuery () {
  'ngInject';

  return {
    require: 'ngModel',
    scope: {
      parserFormatter: '='
    },
    link (scope, element, attrs, ctrl) {
      ctrl.$formatters.push(function parseToInput (x) {
        const result = scope.parserFormatter.formatter(x);

        if (result instanceof Error)
          throw result;

        return result;
      });

      ctrl.$parsers.push(function parseToQs (x) {
        const result = scope.parserFormatter.parser(x);

        if (result instanceof Error)
          return undefined;

        return result;
      });
    }
  };
}
