// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';

import type {
  qsFromLocationT
} from '../qs-from-location/qs-from-location-module.js';

import type {
  TransitionT,
  TransitionServiceT,
  HookMatchCriteriaT
} from 'angular-ui-router';

export default ($transitions:TransitionServiceT, qsFromLocation:qsFromLocationT) => {
  'ngInject';

  return (params:Object, match:HookMatchCriteriaT = {}) => {
    const s = highland();

    const d = $transitions.onSuccess(match, (t:TransitionT) => {
      s.write({
        qs: qsFromLocation(t.params())
      });
    });

    s.onDestroy(d);

    s.write({
      qs: qsFromLocation(params)
    });

    return s;
  };
};
