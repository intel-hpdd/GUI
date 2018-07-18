// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
