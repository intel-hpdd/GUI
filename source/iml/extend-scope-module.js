//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from '@mfl/fp';

import type { $scopeT } from 'angular';

export type localApplyT<R> = (scope: $scopeT, fn: (...rest: any[]) => R) => ?R;

export type PropagateChange = <T>(
  $scopeT,
  Object,
  string,
  HighlandStreamT<T>
) => HighlandStreamT<T>;

export default angular
  .module('extendScope', [])
  .config([
    '$provide',
    function addHandleExceptionMethod($provide) {
      return $provide.decorator('$rootScope', [
        '$delegate',
        '$exceptionHandler',
        function addExceptionHandler($delegate, $exceptionHandler) {
          $delegate.handleException = fp.unary($exceptionHandler);

          return $delegate;
        }
      ]);
    }
  ])
  .config([
    '$provide',
    function addLocalApplyMethod($provide) {
      return $provide.decorator('$rootScope', [
        '$delegate',
        'localApply',
        function addLocalApply($delegate, localApply) {
          $delegate.localApply = localApply;

          return $delegate;
        }
      ]);
    }
  ])
  .config([
    '$provide',
    function addPropagateChangeMethod($provide) {
      return $provide.decorator('$rootScope', [
        '$delegate',
        'propagateChange',
        function addPropagateChange($delegate, propagateChange) {
          $delegate.propagateChange = propagateChange;

          return $delegate;
        }
      ]);
    }
  ])
  .factory('localApply', [
    '$exceptionHandler',
    function localApplyFactory($exceptionHandler) {
      return function localApply(scope, fn) {
        try {
          if (typeof fn === 'function') return fn();
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          try {
            if (!scope.$$destroyed && !scope.$root.$$phase) scope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            throw e;
          }
        }
      };
    }
  ])
  .factory('propagateChange', function propagateChangeFactory(
    $exceptionHandler,
    localApply
  ) {
    'ngInject';
    return ($scope, obj, prop, s) =>
      s
        .tap(x => {
          obj[prop] = x;
        })
        .stopOnError(fp.unary($exceptionHandler))
        .each(localApply.bind(null, $scope));
  }).name;
