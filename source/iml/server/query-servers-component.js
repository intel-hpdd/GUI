// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getStore from "../store/get-store.js";
import { PdshComponent } from "../pdsh/pdsh.js";
import { default as ServerAuthorizationComponent } from "./server-authorization-component.js";
import { CSSTransitionGroup } from "inferno-css-transition-group";
import { QueryServerStatusComponent } from "./server-status-component.js";
import deployAgent from "./deploy-agent.js";
import {
  ADD_SERVER_MODAL_SELECT_PROFILE_STEP,
  ADD_SERVER_MODAL_INTERSTITIAL_STEP,
  ADD_SERVER_MODAL_CLEAR_EXPRESSION,
  ADD_SERVER_MODAL_SET_EXPRESSION,
  ADD_SERVER_MODAL_SET_PROFILES,
  type AddServerModalPayloadT,
  ADD_SERVER_MODAL_CONFIRM_PROCEED
} from "./add-server-modal-reducer.js";

import { SHOW_EXCEPTION_MODAL_ACTION } from "../exception/exception-modal-reducer.js";
import type { ProfileT } from "./server-module.js";

const onExpressionSet = (pdshExpression: string, addresses: string[]) => {
  if (addresses.length === 0)
    getStore.dispatch({
      type: ADD_SERVER_MODAL_CLEAR_EXPRESSION,
      payload: {}
    });
  else
    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_EXPRESSION,
      payload: {
        addresses,
        pdshExpression
      }
    });
};

const onSubmitForm = (disabled: boolean) => e => {
  e.preventDefault();
  if (disabled === false)
    getStore.dispatch({
      type: ADD_SERVER_MODAL_CONFIRM_PROCEED,
      payload: { confirmProceed: true }
    });
};

const QueryServersComponent = (props: AddServerModalPayloadT) => {
  handleState(props);

  let clusterStatusTitle = null;
  if (props.testHostsStatus.length > 0 && props.testingHosts === false)
    clusterStatusTitle = <h2 class="server-status-header">Cluster Status</h2>;

  return (
    <form name="addServerForm" novalidate onSubmit={onSubmitForm(props.proceedButton.disabled)}>
      <div class="add-server-section">
        <PdshComponent onExpressionSet={onExpressionSet} showSpinner={props.testingHosts} />
        <ServerAuthorizationComponent
          authType={props.authType}
          rootPassword={props.rootPassword}
          privateKey={props.privateKey}
          privateKeyPassphrase={props.privateKeyPassphrase}
        />
      </div>
      <CSSTransitionGroup transitionName="ng" transitionEnterTimeout={500} transitionLeaveTimeout={500} component="div">
        {clusterStatusTitle}
      </CSSTransitionGroup>
      <div class="add-server-section">
        <QueryServerStatusComponent hosts={props.testHostsStatus} />
      </div>
    </form>
  );
};

export default QueryServersComponent;

export function handleState({ authType, deployableAddresses, pdshExpression, transition }: AddServerModalPayloadT) {
  if (transition === true) {
    getStore.dispatch({
      type: ADD_SERVER_MODAL_INTERSTITIAL_STEP,
      payload: {
        title: "Deploying Agents",
        message: "Please wait while agents are being deployed."
      }
    });

    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_EXPRESSION,
      payload: {
        addresses: deployableAddresses,
        pdshExpression
      }
    });

    deployAgent(deployableAddresses, authType)
      .errors(e => {
        getStore.dispatch({
          type: SHOW_EXCEPTION_MODAL_ACTION,
          payload: e
        });
      })
      .each((profiles: ProfileT[]) => {
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
}
