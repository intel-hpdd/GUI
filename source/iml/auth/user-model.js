//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {noop} from 'intel-fp';

export default (modelFactory, EULA_STATES) => {
  'ngInject';

  var UserModel = modelFactory({
    url: 'user/:id',
    params: { id: '@id' }
  });

  UserModel.prototype.actOnEulaState = function actOnEulaState (showFunc, denyFunc, passFunc) {
    passFunc = passFunc || noop;

    var result;

    switch (this.eula_state) {
    case EULA_STATES.PASS:
      result = passFunc(this);
      break;
    case EULA_STATES.EULA:
      result = showFunc(this);
      break;
    case EULA_STATES.DENIED:
      result = denyFunc(this);
      break;
    }

    return result;
  };

  return UserModel;
};
