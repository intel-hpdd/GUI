//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function overrideActionClickFactory (ADD_SERVER_STEPS, openAddServerModal, λ) {
  'ngInject';

  return function overrideActionClick (record, action) {
    var notRemoving = (action.state && action.state !== 'removed') && action.verb !== 'Force Remove';
    var openForDeploy = record.state === 'undeployed';
    var openForConfigure = (record.server_profile && record.server_profile.initial_state === 'unconfigured');

    if ((openForDeploy || openForConfigure) && notRemoving) {
      var step;
      if (record.install_method !== 'existing_keys_choice')
        step = ADD_SERVER_STEPS.ADD;
      else if (openForDeploy)
        step = ADD_SERVER_STEPS.STATUS;
      else
        step = ADD_SERVER_STEPS.SELECT_PROFILE;

      return openAddServerModal(record, step).resultStream;
    } else {
      return λ(['fallback']);
    }
  };
}
