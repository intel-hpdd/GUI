// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "./global.js";
import { handleAction, handleCheckDeploy, handleCheckDeployPredicate } from "./action-dropdown/handle-action.js";
import { type RecordT } from "./action-dropdown/action-dropdown-module.js";

import {
  type SelectedActionAndRecordT,
  ACTION_DROPDOWN_FLAG_CHECK_DEPLOY
} from "./action-dropdown/action-dropdown-module.js";

global.addEventListener(
  "action_selected",
  ({
    detail: {
      available_action: availableAction,
      record: { label, resource_uri: resourceUri, ...record },
      flag
    }
  }: {
    detail: SelectedActionAndRecordT
  }) => {
    if (availableAction != null && record != null) {
      switch (flag) {
        case ACTION_DROPDOWN_FLAG_CHECK_DEPLOY:
          if (handleCheckDeployPredicate(availableAction, record.state, record.server_profile))
            return handleCheckDeploy({ ...record, label, resourceUri });
          break;
      }

      handleAction(availableAction, label, resourceUri);
    }
  }
);

export const openAddServerModal = (record: RecordT, step: string) => {
  const evt = new CustomEvent("open_add_server_modal", {
    detail: { record, step }
  });

  global.dispatchEvent(evt);
};
