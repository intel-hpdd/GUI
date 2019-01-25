// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import { render } from "inferno";
import commandModule from "../command/command-module";
import { actionDropdown } from "./action-dropdown";
import handleActionFactory from "./handle-action";
import uiBootstrapModule from "angular-ui-bootstrap";
import getStore from "../store/get-store.js";
import { querySelector } from "../dom-utils";
import highland from "highland";
import global from "../global.js";
import { ConfirmActionModal } from "./confirm-action-modal.js";
import { SET_ACTION_DROPDOWN_INACTIVE_ACTION } from "./action-dropdown-reducer";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer";

import type { Command } from "../command/command-types.js";

export default angular
  .module("action-dropdown-module", [commandModule, uiBootstrapModule])
  .component("actionDropdown", actionDropdown)
  .factory("handleAction", handleActionFactory).name;

getStore.select("confirmAction").each(({ action, message, prompts, required }: ConfirmActionPayloadT) => {
  if (required) {
    const body = querySelector(global.document, "body");
    const container = document.createElement("div");
    body.appendChild(container);

    const stream = highland();
    render(<ConfirmActionModal message={message} prompts={[...prompts]} stream={stream} />, container);

    stream.pull((e, x: boolean) => {
      render(null, container);
      body.removeChild(container);

      if (e != null)
        getStore.dispatch({
          type: SET_ACTION_DROPDOWN_INACTIVE_ACTION,
          payload: {}
        });
      else if (x === true)
        action().each(() => {
          getStore.dispatch({
            type: SET_ACTION_DROPDOWN_INACTIVE_ACTION,
            payload: {}
          });
        });
      else if (x === false)
        action().each((x: Command | { command: Command }) => {
          getStore.dispatch({
            type: SHOW_COMMAND_MODAL_ACTION,
            payload: [x.command || x]
          });
        });
    });
  } else if (action != null) {
    action().each((x: Command | { command: Command }) => {
      getStore.dispatch({
        type: SHOW_COMMAND_MODAL_ACTION,
        payload: [x.command || x]
      });
    });
  }
});
