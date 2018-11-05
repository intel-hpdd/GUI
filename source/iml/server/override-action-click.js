//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { handleAction } from "../action-dropdown/handle-action.js";
import {
  ADD_SERVER_MODAL_RESET_STATE,
  ADD_SERVER_MODAL_SET_EXPRESSION,
  ADD_SERVER_MODAL_SET_PROFILES,
  ADD_SERVER_MODAL_SELECT_PROFILE_STEP,
  ADD_SERVER_MODAL_SHOW_MODAL,
  ADD_SERVER_MODAL_INTERSTITIAL_STEP
} from "../server/add-server-modal-reducer.js";
import { handleState as handleDeployAgent } from "./query-servers-component.js";

import getStore from "../store/get-store.js";
import { getHostProfiles } from "./create-host-profiles-stream.js";
import { sortProfiles } from "./deploy-agent.js";

import type { ProfileT, HostT } from "./server-module.js";

const overrideActionClick = (action, record: HostT) => {
  const notRemoving = action.state && action.state !== "removed" && action.verb !== "Force Remove";
  const openForDeploy = record.state === "undeployed";
  const openForConfigure = record.server_profile && record.server_profile.initial_state === "unconfigured";

  if ((openForDeploy || openForConfigure) && notRemoving)
    if (record.install_method !== "existing_keys_choice" || openForDeploy) {
      getStore.dispatch({
        type: ADD_SERVER_MODAL_RESET_STATE,
        payload: {}
      });

      getStore.dispatch({
        type: ADD_SERVER_MODAL_INTERSTITIAL_STEP,
        payload: {
          title: "Deploying Agents",
          message: "Please wait while agents are being deployed."
        }
      });

      getStore.dispatch({
        type: ADD_SERVER_MODAL_SHOW_MODAL,
        payload: {}
      });

      handleDeployAgent({
        authType: record.authType,
        deployableAddresses: [record.address],
        pdshExpression: record.address,
        transition: true
      });
    } else {
      getStore.dispatch({
        type: ADD_SERVER_MODAL_RESET_STATE,
        payload: {}
      });

      getStore.dispatch({
        type: ADD_SERVER_MODAL_INTERSTITIAL_STEP,
        payload: {
          title: "Continue Server Setup",
          message: "Please wait while the server configurations are being loaded."
        }
      });

      getHostProfiles([record])
        .map(sortProfiles)
        .each((profiles: ProfileT[]) => {
          getStore.dispatch({
            type: ADD_SERVER_MODAL_SHOW_MODAL,
            payload: {}
          });

          getStore.dispatch({
            type: ADD_SERVER_MODAL_SET_EXPRESSION,
            payload: {
              addresses: [record.address],
              pdshExpression: record.address
            }
          });

          getStore.dispatch({
            type: ADD_SERVER_MODAL_SET_PROFILES,
            payload: {
              profiles
            }
          });

          getStore.dispatch({
            type: ADD_SERVER_MODAL_SELECT_PROFILE_STEP,
            payload: {}
          });
        });
    }
  else handleAction(action, record);
};

export default overrideActionClick;
