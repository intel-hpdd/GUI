// @flow

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
import {always} from 'intel-fp';

import type {
  getTemplatePromiseT
} from '../get-template-promise/get-template-promise-module.js';

import type {
  resolveStreamT
} from '../socket/socket-module.js';

import type {
  addPropertyT,
  rebindDestroyT
} from '../highland/highland-module.js';

import type {
  HighlandStreamT
} from 'highland';

import type {
  scopeToElementT
} from './chart-compiler-module.js';

type scopeToStreamToObject = ($scope:Object, s:HighlandStreamT<mixed>) => Object;

export function chartCompilerFactory ($compile:Function, $q:typeof Promise, getTemplatePromise:getTemplatePromiseT,
                                      resolveStream:resolveStreamT<mixed>, addProperty:addPropertyT,
                                      rebindDestroy:rebindDestroyT<mixed, scopeToElementT>) {
  'ngInject';

  return function chartCompiler (template:string,
    stream:HighlandStreamT<mixed>, fn:scopeToStreamToObject):Promise<scopeToElementT> {

    return $q.all([
      getTemplatePromise(template),
      resolveStream(stream)
    ])
    .then(function compile ([template, stream]) {
      const el = angular.element(template);
      const s2 = addProperty(stream);

      rebindDestroy(always(compiler), s2);
      return compiler;

      function compiler ($scope) {
        var cloned = el.clone();

        $scope.chart = fn($scope, s2.property());

        $scope.$on('$destroy', () => $scope.chart = null);

        return $compile(cloned)($scope);
      }
    });
  };
}
