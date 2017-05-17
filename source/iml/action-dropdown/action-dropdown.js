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
import * as fp from '@mfl/fp';
import getCommandStream from '../command/get-command-stream.js';

export function actionDescriptionCache($sce) {
  'ngInject';
  const cache = {};

  return function sceDescriptionCache(str) {
    return cache[str] || (cache[str] = $sce.trustAsHtml(str));
  };
}

export function ActionDropdownCtrl(
  $scope,
  $exceptionHandler,
  handleAction,
  actionDescriptionCache,
  openCommandModal,
  localApply,
  propagateChange
) {
  'ngInject';
  const setConfirmOpen = isOpen => (this.confirmOpen = isOpen);

  const ctrl = angular.merge(this, {
    actionDescriptionCache,
    handleAction(record, action) {
      setConfirmOpen(true);

      const run = runHandleAction.bind(null, record, action);

      let stream;
      if (ctrl.overrideClick)
        stream = ctrl
          .overrideClick({
            record,
            action
          })
          .reject(fp.eq('fallback'))
          .otherwise(run);
      else stream = run();

      stream.pull(err => {
        if (err) $exceptionHandler(err);

        setConfirmOpen(false);

        localApply($scope);
      });
    },
    tooltipPlacement: this.tooltipPlacement || 'left',
    actionsProperty: this.actionsProperty || 'available_actions',
    receivedData: false
  });

  const extractPathLengths = fp.view(
    fp.compose(
      fp.mapped,
      fp.lensProp('locks'),
      fp.lensProp('write'),
      fp.lensProp('length')
    )
  );

  const p = propagateChange.bind(null, $scope, ctrl, 'records');

  const asArray = fp.cond(
    [fp.flow(Array.isArray, fp.not), fp.arrayWrap],
    [fp.True, fp.identity]
  );

  const add = (x, y) => x + y;

  ctrl.stream
    .map(asArray)
    .map(fp.filter(x => x.locks && x[ctrl.actionsProperty]))
    .tap(() => (ctrl.receivedData = true))
    .tap(
      fp.flow(
        extractPathLengths,
        fp.reduce(0, add),
        locks => (ctrl.locks = locks)
      )
    )
    .through(p);

  function runHandleAction(record, action) {
    return handleAction(record, action)
      .filter(fp.identity)
      .flatMap(function openModal(x) {
        const stream = getCommandStream([x.command || x]);

        return openCommandModal(stream).resultStream.tap(
          stream.destroy.bind(stream)
        );
      });
  }
}

export function actionDropdown() {
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
    template: `<div class="action-dropdown">
  <button ng-if="ctrl.locks || ctrl.confirmOpen" disabled class="btn btn-primary btn-sm">Disabled</button>
  <button ng-if="ctrl.receivedData && ctrl.records.length === 0" disabled class="btn btn-primary btn-sm">No Actions</button>
  <div ng-if="!ctrl.locks && !ctrl.confirmOpen" class="btn-group" uib-dropdown>
    <button ng-if="!ctrl.receivedData || ctrl.records.length > 0" class="btn btn-primary btn-sm" uib-dropdown-toggle>
      Actions<i class="fa fa-caret-down"></i>
    </button>
    <ul uib-dropdown-menu class="uib-dropdown-menu" role="menu">
      <li class="dropdown-header" ng-repeat-start="record in ctrl.records track by record.label">
        {{ ::record.label }}
      </li>
      <li class="tooltip-container tooltip-hover" ng-class="{ 'end-of-group': action.last }" ng-repeat="action in record[ctrl.actionsProperty] | groupActions track by action.verb">
        <a ng-click="::ctrl.handleAction(record, action)">
           {{ ::action.verb }}
        </a>
        <iml-tooltip size="'large'" direction="{{::ctrl.tooltipPlacement}}">
          <p ng-bind-html="ctrl.actionDescriptionCache(action.long_description)"></p>
        </iml-tooltip>
      </li>
      <li ng-repeat-end class="divider"></li>
    </ul>
  </div>
</div>`
  };
}
