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

import angular from 'angular/angular';

import {lensProp, __, eq, pathLens, cond,
  map, reduce, flow, identity,
  not, arrayWrap, True} from 'intel-fp/fp';

var confirmOpen = lensProp('confirmOpen');

export function actionDescriptionCache ($sce) {
  'ngInject';

  const cache = {};

  return function sceDescriptionCache (str) {
    return cache[str] || (cache[str] = $sce.trustAsHtml(str));
  };
}

export function ActionDropdownCtrl ($scope, $exceptionHandler, handleAction,
                                    actionDescriptionCache, openCommandModal,
                                    getCommandStream, localApply, propagateChange) {
  'ngInject';

  var setConfirmOpen = confirmOpen.set(__, this);

  var ctrl = angular.merge(this, {
    actionDescriptionCache: actionDescriptionCache,
    handleAction: function handleAction (record, action) {
      setConfirmOpen(true);

      var run = runHandleAction.bind(null, record, action);

      var stream;
      if (ctrl.overrideClick)
        stream = ctrl.overrideClick({
          record: record,
          action: action
        })
          .reject(eq('fallback'))
          .otherwise(run);
      else
        stream = run();

      stream
        .pull(function getData (err) {
          if (err)
            $exceptionHandler(err);

          setConfirmOpen(false);

          localApply($scope);
        });
    }
  });

  var writeLocks = pathLens(['locks', 'write', 'length']);

  var p = propagateChange($scope, ctrl, 'records');

  var asArray = cond(
    [flow(Array.isArray, not), arrayWrap],
    [True, identity]
  );

  ctrl.stream
    .map(asArray)
    .tap(flow(
      map(writeLocks),
      reduce(0, add),
      lensProp('locks').set(__, ctrl)
    ))
    .through(p);

  function add (x, y) { return x + y; }

  function runHandleAction (record, action) {
    return handleAction(record, action)
      .filter(identity)
      .flatMap(function openModal (x) {
        var stream = getCommandStream([x.command || x]);

        return openCommandModal(stream)
          .resultStream
          .tap(stream.destroy.bind(stream));
      });
  }
}

export function actionDropdown () {
  'ngInject';

  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      stream: '=',
      overrideClick: '&?'
    },
    controller: 'ActionDropdownCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'iml/action-dropdown/assets/html/action-dropdown.html',
    link: function link (scope, el, attrs) {
      scope.tooltipPlacement = attrs.tooltipPlacement != null ? attrs.tooltipPlacement : 'left';
      scope.actionsProperty = attrs.actionsProperty != null ? attrs.actionsProperty : 'available_actions';
    }
  };
}
