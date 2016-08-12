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
import getCommandStream from '../command/get-command-stream.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import actionDropdownTemplate from './assets/html/action-dropdown.html!text';

import {lensProp, eq, view, cond, mapped, compose,
  reduce, flow, identity, filter,
  not, arrayWrap, True} from 'intel-fp';

export function actionDescriptionCache ($sce) {
  'ngInject';

  const cache = {};

  return function sceDescriptionCache (str) {
    return cache[str] || (cache[str] = $sce.trustAsHtml(str));
  };
}

export function ActionDropdownCtrl ($scope, $exceptionHandler, handleAction,
                                    actionDescriptionCache, openCommandModal,
                                    localApply, propagateChange) {
  'ngInject';

  const setConfirmOpen = isOpen => this.confirmOpen = isOpen;

  var ctrl = angular.merge(this, {
    actionDescriptionCache,
    handleAction (record, action) {
      setConfirmOpen(true);

      var run = runHandleAction.bind(null, record, action);

      var stream;
      if (ctrl.overrideClick)
        stream = ctrl.overrideClick({
          record,
          action
        })
          .reject(eq('fallback'))
          .otherwise(run);
      else
        stream = run();

      stream
        .pull(err => {
          if (err)
            $exceptionHandler(err);

          setConfirmOpen(false);

          localApply($scope);
        });
    },
    tooltipPlacement: this.tooltipPlacement || 'left',
    actionsProperty: this.actionsProperty || 'available_actions',
    receivedData: false
  });

  const extractPathLengths = view(
    compose(
      mapped,
      lensProp('locks'),
      lensProp('write'),
      lensProp('length')
    )
  );

  var p = propagateChange($scope, ctrl, 'records');

  var asArray = cond(
    [flow(Array.isArray, not), arrayWrap],
    [True, identity]
  );

  const add = (x, y) => x + y;

  ctrl.stream
    .map(asArray)
    .map(filter(x => x.locks && x[ctrl.actionsProperty]))
    .tap(() => ctrl.receivedData = true)
    .tap(flow(
      extractPathLengths,
      reduce(0, add),
      locks => ctrl.locks = locks
    ))
    .through(p);

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
      tooltipPlacement: '@?',
      actionsProperty: '@?',
      stream: '=',
      overrideClick: '&?'
    },
    controller: 'ActionDropdownCtrl',
    controllerAs: 'ctrl',
    template: actionDropdownTemplate
  };
}
