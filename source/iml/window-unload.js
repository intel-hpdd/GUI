//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type windowUnloadT = {
  unloading: boolean
};

export default function windowUnloadFactory($window) {
  'ngInject';
  const state: windowUnloadT = { unloading: false };

  $window.addEventListener('beforeunload', function beforeUnload() {
    state.unloading = true;
  });

  return state;
}
