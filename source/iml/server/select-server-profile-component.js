// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import WindowClickListener from "../window-click-listener.js";
import { ProfileStatusComponent } from "./server-status-component.js";
import getStore from "../store/get-store.js";
import { CSSTransitionGroup } from "inferno-css-transition-group";
import DropdownSelectComponent from "../dropdown-select-component.js";
import { createHostProfiles } from "./create-host-profiles-stream.js";

import { type ProfileT } from "./server-module.js";
import {
  ADD_SERVER_MODAL_CLOSE_MODAL,
  ADD_SERVER_MODAL_INTERSTITIAL_STEP,
  type AddServerModalPayloadT,
  ADD_SERVER_MODAL_SET_SELECTED_PROFILE,
  ADD_SERVER_MODAL_END_TRANSITION
} from "./add-server-modal-reducer.js";
import { SHOW_EXCEPTION_MODAL_ACTION } from "../exception/exception-modal-reducer.js";

const NoServersComponent = ({ profiles }: { profiles: ProfileT[] }) => {
  if (profiles.length > 0) return;

  return (
    <div class="add-server-section no-server-selected">
      <i class="fa fa-exclamation-circle" />
      <div>
        <h3>No Servers Selected</h3>
        <div>No servers are selected. Please go back and enter a hostlist of servers to deploy.</div>
      </div>
    </div>
  );
};

const selectProfile = (profiles: ProfileT[]) => (profileUiName: string) => {
  const selectedProfile = profiles.find(x => x.uiName === profileUiName);
  if (selectedProfile != null)
    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_SELECTED_PROFILE,
      payload: { selectedProfile }
    });
};

const SelectServerProfileComponent = ({ ...props }: AddServerModalPayloadT) => {
  handleState({ ...props });

  const profiles = [...props.profiles];
  const selectProfileFromAvailableProfiles = selectProfile(profiles);
  if (profiles.length > 0 && props.selectedProfile == null) selectProfileFromAvailableProfiles(profiles[0].uiName);

  const noServersComponent = NoServersComponent({ profiles });
  const profileOptions = profiles.map((profile: ProfileT) => {
    return (
      <li>
        <a>{profile.uiName}</a>
      </li>
    );
  });

  let serverStatusHeader = null;
  let profileSelection = null;
  let serverStatus = null;
  if (profiles.length > 0) {
    profileSelection = (
      <div class="add-server-section">
        <WindowClickListener>
          <DropdownSelectComponent extraCss={["fancy-select-box"]} onSelectItem={selectProfileFromAvailableProfiles}>
            <ul>{profileOptions}</ul>
          </DropdownSelectComponent>
        </WindowClickListener>
      </div>
    );

    if (props.testingHosts === false && props.selectedProfile != null) {
      serverStatusHeader = <h2 class="server-status-header">Cluster Status</h2>;
      serverStatus = <ProfileStatusComponent hosts={props.selectedProfile.hosts} />;
    }
  }

  return (
    <>
      <CSSTransitionGroup transitionName="ng" transitionEnterTimeout={500} transitionLeaveTimeout={500} component="div">
        {noServersComponent}
      </CSSTransitionGroup>
      {profileSelection}
      <CSSTransitionGroup transitionName="ng" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        {serverStatusHeader}
      </CSSTransitionGroup>
      <div class="add-server-section">{serverStatus}</div>
    </>
  );
};

export default SelectServerProfileComponent;

function handleState({ transition, selectedProfile }: AddServerModalPayloadT) {
  if (transition === true && selectedProfile != null) {
    getStore.dispatch({
      type: ADD_SERVER_MODAL_INTERSTITIAL_STEP,
      payload: {
        title: "Installing Profiles",
        message: "Please wait while the profiles are being installed."
      }
    });

    createHostProfiles(selectedProfile, true).pull(err => {
      if (err)
        getStore.dispatch({
          type: SHOW_EXCEPTION_MODAL_ACTION,
          payload: err
        });

      getStore.dispatch({
        type: ADD_SERVER_MODAL_END_TRANSITION,
        payload: {}
      });

      getStore.dispatch({
        type: ADD_SERVER_MODAL_CLOSE_MODAL,
        payload: {}
      });
    });
  }
}
