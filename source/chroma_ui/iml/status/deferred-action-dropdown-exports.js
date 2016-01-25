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

import {curry, map, __, lensProp, flow, once} from 'intel-fp/fp';
import highland from 'highland';

import type {HighlandStream} from '../../../../flow/include/highland';

export function DeferredActionDropdownCtrl ($scope:Object, socketStream:Function,
                                            multiStream:(xs:Array<HighlandStream>) => HighlandStream,
                                            localApply:Function):void {
  'ngInject';

  const ctrl = this;

  socketStream = curry(2, socketStream);
  const getActions = map(socketStream(__, {
    jsonMask: 'resource_uri,available_actions,locks,id,label'
  }));
  const getMs = flow(getActions, multiStream);

  ctrl.ms = highland();

  const setLoading = lensProp('loading')
    .set(__, ctrl);

  ctrl.onEnter = once(() => {
    setLoading(true);

    const ms:HighlandStream = getMs(ctrl.row.affected);

    ms.tap(setLoading.bind(null, false))
      .tap(localApply.bind(null, $scope))
      .pipe(ctrl.ms);

    $scope.$on('$destroy', ms.destroy.bind(ms));
  });
}

export const deferredActionDropdownComponent = {
  bindings: {
    row: '='
  },
  controller: 'DeferredActionDropdownCtrl as ctrl',
  template: `
      <div ng-mouseenter="::ctrl.onEnter()">
        <button class="btn btn-sm btn-default loading-btn" disabled ng-if="ctrl.loading">
          <i class="fa fa-spinner fa-spin"></i>Waiting
        </button>
        <action-dropdown ng-show="!ctrl.loading" stream="::ctrl.ms"></action-dropdown>
      </div>`
};
