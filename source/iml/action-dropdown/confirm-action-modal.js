//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import WindowClickListener from "../window-click-listener.js";
import { linkEvent, render, Component } from "inferno";
import DropdownComponent from "../dropdown-component.js";
import getStore from "../store/get-store.js";
import global from "../global.js";
import { querySelector } from "../dom-utils.js";
import { SET_ACTION_DROPDOWN_INACTIVE_ACTION } from "./action-dropdown-reducer.js";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";
import highland from "highland";

import type { ConfirmActionPayloadT } from "./confirm-action-reducer.js";
import type { HighlandStreamT } from "highland";
import type { Command } from "../command/command-types.js";

const Confirmation = ({ confirmPrompts }) => {
  if (confirmPrompts.length === 1)
    return (
      <div class="single-confirmation">
        <p>{confirmPrompts[0]}</p>
      </div>
    );
  else if (confirmPrompts.length > 1)
    return (
      <div class="multi-confirmation">
        <h4>This action will:</h4>
        <ul class="well">
          {confirmPrompts.map(message => (
            <li>{message}</li>
          ))}
        </ul>
      </div>
    );
  else if (confirmPrompts.length === 0)
    return (
      <div>
        <p>Are you sure you want to perform this action?</p>
      </div>
    );
};

const onConfirm = ({ stream }) => {
  stream.write(false);
  stream.end();
};

const onConfirmAndSkip = ({ stream }) => {
  stream.write(true);
  stream.end();
};

const onCancel = ({ stream }) => {
  stream.write({
    __HighlandStreamError__: true,
    error: "cancel"
  });
  stream.end();
};

type ConfirmActionModalProps = {
  message: string,
  prompts: string[],
  stream: HighlandStreamT<boolean>
};

export const ConfirmActionModal = ({ message, prompts, stream }: ConfirmActionModalProps) => {
  return (
    <div id="confirm-modal" class="modal-open">
      <Modal visible={true} moreClasses={["confirm-action-modal"]}>
        <Header class="modal-header">
          <h4 class="modal-title">Confirm {message}</h4>
        </Header>
        <Body>
          <Confirmation confirmPrompts={prompts} />
        </Body>
        <Footer class="modal-footer">
          <div class="btn-group">
            <button type="button" class="btn btn-success" onClick={linkEvent({ stream }, onConfirm)}>
              Confirm <i class="fa fa-check-circle-o" />
            </button>
            <WindowClickListener>
              <DropdownComponent>
                <button
                  type="button"
                  class="btn btn-success dropdown-toggle"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span class="caret" />
                  <span class="sr-only">Split button</span>
                </button>
                <ul role="menu" class="dropdown-menu">
                  <li>
                    <a onClick={linkEvent({ stream }, onConfirmAndSkip)}>Confirm and skip command view</a>
                  </li>
                </ul>
              </DropdownComponent>
            </WindowClickListener>
          </div>

          <button class="btn btn-danger" onClick={linkEvent({ stream }, onCancel)}>
            Cancel <i class="fa fa-times-circle-o" />
          </button>
        </Footer>
      </Modal>
      <Backdrop visible={true} moreClasses={["confirm-action-modal-backdrop"]} />
    </div>
  );
};
