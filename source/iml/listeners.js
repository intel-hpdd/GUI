// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "./global.js";
import { handleAction, handleCheckDeploy, handleCheckDeployPredicate } from "./action-dropdown/handle-action.js";
import {
  type RecordT,
  type RecordAndHsmControlParamT,
  type RecordAndSelectedActionT,
  ACTION_DROPDOWN_FLAG_CHECK_DEPLOY
} from "./action-dropdown/action-dropdown-types.js";
import { SHOW_COMMAND_MODAL_ACTION } from "./command/command-modal-reducer.js";
import getStore from "./store/get-store.js";

import { type Command } from "./command/command-types.js";

global.addEventListener(
  "action_selected",
  ({
    detail: {
      available_action: availableAction,
      record: { label, resource_uri: resourceUri, ...record },
      flag
    }
  }: {
    detail: RecordAndSelectedActionT
  }) => {
    if (availableAction != null && record != null) {
      switch (flag) {
        case ACTION_DROPDOWN_FLAG_CHECK_DEPLOY:
          if (handleCheckDeployPredicate(availableAction, record.state, record.server_profile))
            return handleCheckDeploy({ ...record, label, resourceUri });
      }

      handleAction(availableAction, label, resourceUri);
    }
  }
);

global.addEventListener(
  "hsm_action_selected",
  ({ detail: { record, hsm_control_param: hsmControlParam } }: { detail: RecordAndHsmControlParamT }) => {
    handleAction(hsmControlParam, record.label);
  }
);

global.addEventListener("show_command_modal", ({ detail: { command } }: { detail: { command: Command } }) => {
  if (command != null)
    getStore.dispatch({
      type: SHOW_COMMAND_MODAL_ACTION,
      payload: [command]
    });
});

export const handleSelectedAction = (action: RecordAndSelectedActionT) => {
  const evt = new CustomEvent("action_selected", {
    detail: action
  });

  global.dispatchEvent(evt);
};

export const openAddServerModal = (record: RecordT, step: string) => {
  const evt = new CustomEvent("open_add_server_modal", {
    detail: { record, step }
  });

  global.dispatchEvent(evt);
};

export const closeCommandModal = () => {
  const evt = new CustomEvent("close_command_modal");

  global.dispatchEvent(evt);
};
