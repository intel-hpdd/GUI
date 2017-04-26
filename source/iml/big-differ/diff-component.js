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

export const CLEAN = 'clean';
export const LOCAL = 'local';
export const REMOTE = 'remote';
export const CONFLICT = 'conflict';

type State = {
  status: string,
  initial: any,
  local: any,
  remote: any
};

export type diffComponentCtrl = {
  localChange: Function,
  subscribe: Function,
  remoteChange: Function,
  reset: () => void
};

export function DiffComponentCtrl($scope: Object) {
  'ngInject';
  this.$onInit = () => {
    let state: State = {
      status: CLEAN,
      initial: null,
      local: null,
      remote: null
    };

    const listeners: Array<Function> = [];

    this.getState = () => state;

    this.subscribe = fn => {
      listeners.push(fn);
      fn(state);
    };

    this.emit = x => listeners.forEach(fn => fn(x));

    this.localChange = x => {
      state.local = x;

      state = updateState(state);

      this.emit(state);
    };

    this.remoteChange = x => {
      if (!state.initial) {
        Object.assign(state, {
          initial: x,
          local: x,
          remote: x
        });

        return x;
      }

      state.remote = x;

      state = updateState(state);

      this.emit(state);

      return state.local;
    };

    this.reset = () => {
      if (state.status === REMOTE || state.status === CONFLICT)
        Object.assign(state, {
          status: CLEAN,
          local: state.remote,
          initial: state.remote
        });
      else
        Object.assign(state, {
          status: CLEAN,
          local: state.initial,
          remote: state.initial
        });

      this.emit(state);
    };

    this.diffContainerCtrl.register(this);
  };

  $scope.$on('$destroy', () => {
    this.diffContainerCtrl.deregister(this);
  });
}

export default {
  require: {
    diffContainerCtrl: '^diffContainer'
  },
  transclude: true,
  controller: DiffComponentCtrl,
  template: `
    <div ng-class="$ctrl.getState().status" ng-transclude></div>
  `
};

function updateState(state) {
  const dirtyLocal = state.initial !== state.local;
  const dirtyRemote = state.initial !== state.remote;
  const dirtyLocalRemote = state.local !== state.remote;

  if (dirtyLocal && dirtyRemote && dirtyLocalRemote)
    return Object.assign({}, state, {
      status: CONFLICT
    });
  else if (dirtyLocal && dirtyRemote)
    return Object.assign({}, state, {
      initial: state.remote,
      status: CLEAN
    });
  else if (dirtyLocal)
    return Object.assign({}, state, {
      status: LOCAL
    });
  else if (dirtyRemote)
    return Object.assign({}, state, {
      status: REMOTE
    });
  else
    return Object.assign({}, state, {
      status: CLEAN
    });
}
