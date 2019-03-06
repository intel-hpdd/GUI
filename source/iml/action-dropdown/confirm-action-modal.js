//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import WindowClickListener from "../window-click-listener.js";
import WindowKeyListener from "../window-key-listener.js";
import DropdownComponent from "../dropdown-component.js";
import { MODAL_STACK_ADD_MODAL, MODAL_STACK_REMOVE_MODAL } from "../modal-stack-reducer.js";
import getStore from "../store/get-store.js";
import { Component } from "inferno";

const CONFIRM_ACTION_COMMAND_MODAL_NAME: "CONFIRM_ACTION_COMMAND_MODAL_NAME" = "CONFIRM_ACTION_COMMAND_MODAL_NAME";

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

export const ConfirmActionStates = {
  CANCEL: "cancel",
  CONFIRM: "confirm",
  CONFIRM_AND_SKIP: "confirm_and_skip"
};

type ConfirmActionModalPropsT = {
  message: string,
  prompts: string[],
  cb: (string, () => HighlandStreamT<*>) => void
};

export class ConfirmActionModal extends Component {
  props: ConfirmActionModalPropsT;
  state: ConfirmActionModalStateT;

  modalStack$: HighlandStreamT<string[]>;

  componentDidMount() {
    this.modalStack$ = getStore.select("modalStack");
    this.modalStack$.each((xs: string[]) => {
      const [top] = [...xs];

      if (top)
        this.setState({
          topModalName: top
        });
    });

    getStore.dispatch({
      type: MODAL_STACK_ADD_MODAL,
      payload: CONFIRM_ACTION_COMMAND_MODAL_NAME
    });
  }

  componentWillUnmount() {
    getStore.dispatch({
      type: MODAL_STACK_REMOVE_MODAL,
      payload: CONFIRM_ACTION_COMMAND_MODAL_NAME
    });
    this.modalStack$.end();
  }

  onEscape = (e: SyntheticKeyboardEvent<HTMLBodyElement>) => {
    if (e.key === "Escape" && this.state.topModalName === CONFIRM_ACTION_COMMAND_MODAL_NAME)
      this.props.cb(ConfirmActionStates.CANCEL);
  };

  render() {
    return (
      <div id="confirm-modal" class="modal-open">
        <WindowKeyListener onKeyDownHandler={this.onEscape} />
        <Modal visible={true} moreClasses={["confirm-action-modal"]}>
          <Header class="modal-header">
            <h4 class="modal-title">Confirm {this.props.message}</h4>
          </Header>
          <Body>
            <Confirmation confirmPrompts={this.props.prompts} />
          </Body>
          <Footer class="modal-footer">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-success"
                onclick={() => {
                  this.props.cb(ConfirmActionStates.CONFIRM);
                }}
              >
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
                      <a onclick={() => this.props.cb(ConfirmActionStates.CONFIRM_AND_SKIP)}>
                        Confirm and skip command view
                      </a>
                    </li>
                  </ul>
                </DropdownComponent>
              </WindowClickListener>
            </div>

            <button class="btn btn-danger" onclick={() => this.props.cb(ConfirmActionStates.CANCEL)}>
              Cancel <i class="fa fa-times-circle-o" />
            </button>
          </Footer>
        </Modal>
        <Backdrop visible={true} moreClasses={["confirm-action-modal-backdrop"]} />
      </div>
    );
  }
}
