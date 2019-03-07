//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import WindowClickListener from "../window-click-listener.js";
import { linkEvent } from "inferno";
import DropdownComponent from "../dropdown-component.js";

import type { HighlandStreamT } from "highland";

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

const onConfirm = ({ cb }) => {
  cb(ConfirmActionStates.CONFIRM);
};

const onConfirmAndSkip = ({ cb }) => {
  cb(ConfirmActionStates.CONFIRM_AND_SKIP);
};

const onCancel = ({ cb }) => {
  cb(ConfirmActionStates.CANCEL);
};

export const ConfirmActionStates = {
  CANCEL: "cancel",
  CONFIRM: "confirm",
  CONFIRM_AND_SKIP: "confirm_and_skip"
};

type ConfirmActionModalProps = {
  message: string,
  prompts: string[],
  cb: (string, () => HighlandStreamT<*>) => void
};

export const ConfirmActionModal = ({ message, prompts, cb }: ConfirmActionModalProps) => {
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
            <button type="button" class="btn btn-success" onClick={linkEvent({ cb }, onConfirm)}>
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
                    <a onClick={linkEvent({ cb }, onConfirmAndSkip)}>Confirm and skip command view</a>
                  </li>
                </ul>
              </DropdownComponent>
            </WindowClickListener>
          </div>

          <button class="btn btn-danger" onClick={linkEvent({ cb }, onCancel)}>
            Cancel <i class="fa fa-times-circle-o" />
          </button>
        </Footer>
      </Modal>
      <Backdrop visible={true} moreClasses={["confirm-action-modal-backdrop"]} />
    </div>
  );
};
