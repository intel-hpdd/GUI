//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function overrideActionClickFactory(
  ADD_SERVER_STEPS,
  openAddServerModal,
  λ
) {
  'ngInject';
  return function overrideActionClick(record, action) {
    const notRemoving = action.state &&
      action.state !== 'removed' &&
      action.verb !== 'Force Remove';
    const openForDeploy = record.state === 'undeployed';
    const openForConfigure = record.server_profile &&
      record.server_profile.initial_state === 'unconfigured';

    if ((openForDeploy || openForConfigure) && notRemoving) {
      let step;
      if (record.install_method !== 'existing_keys_choice')
        step = ADD_SERVER_STEPS.ADD;
      else if (openForDeploy) step = ADD_SERVER_STEPS.STATUS;
      else step = ADD_SERVER_STEPS.SELECT_PROFILE;

      return openAddServerModal(record, step).resultStream;
    } else {
      return λ(['fallback']);
    }
  };
}
