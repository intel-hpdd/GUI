// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { linkEvent, Component } from "inferno";
import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import Tooltip from "../tooltip.js";
import getStore from "../store/get-store.js";
import InterstitialComponent from "./add-server-interstitial-component.js";
import { default as QueryServersComponent } from "./query-servers-component.js";
import SelectServerProfileComponent from "./select-server-profile-component.js";
import AddServerCompleteComponent from "./add-server-complete-component.js";
import TestHostComponent from "./test-host-component.js";
import WindowKeyListener from "../window-key-listener.js";
import WindowClickListener from "../window-click-listener.js";

import {
  ADD_SERVER_MODAL_CLOSE_MODAL,
  ADD_SERVER_MODAL_SELECT_PROFILE_STEP,
  ADD_SERVER_MODAL_QUERY_SERVER_STEP,
  type AddServerModalPayloadT,
  type StepsT,
  ADD_SERVER_MODAL_COMPLETE_STEP,
  ADD_SERVER_MODAL_START_TRANSITION,
  ADD_SERVER_MODAL_CONFIRM_PROCEED
} from "./add-server-modal-reducer.js";

const onClose = () => {
  getStore.dispatch({
    type: ADD_SERVER_MODAL_CLOSE_MODAL,
    payload: {}
  });
};

const ConfirmButton = ({
  isOpen,
  toggleOpen,
  disabled,
  showSpinner
}: {
  isOpen?: boolean,
  toggleOpen?: () => void,
  disabled: boolean,
  showSpinner: boolean
}) => {
  const buttonLabel = isOpen === true ? "Confirm" : "Proceed";

  return (
    <button
      type={"button"}
      class={`btn ${isOpen === true ? "btn-danger" : "btn-success"}`}
      disabled={disabled}
      onClick={e => {
        if (isOpen === false) {
          if (toggleOpen) toggleOpen();
        } else if (e.detail > 0) {
          getStore.dispatch({
            type: ADD_SERVER_MODAL_START_TRANSITION,
            payload: {}
          });
        }
      }}
    >
      {buttonLabel} <i className={`fa ${showSpinner ? "fa-spinner fa-spin" : "fa-check-circle-o"}`} />
    </button>
  );
};

const ProceedButton = ({
  disabled,
  showSpinner,
  visible,
  confirmProceed,
  step
}: {
  disabled: boolean,
  showSpinner: boolean,
  visible: boolean,
  confirmProceed: boolean,
  step: StepsT
}) => {
  if (visible === false) return null;

  if (step !== ADD_SERVER_MODAL_QUERY_SERVER_STEP) {
    return (
      <button
        type={"button"}
        class="btn btn-success"
        disabled={disabled}
        onClick={() => {
          getStore.dispatch({
            type: ADD_SERVER_MODAL_START_TRANSITION,
            payload: {}
          });
        }}
      >
        Proceed <i className={`fa ${showSpinner ? "fa-spinner fa-spin" : "fa-check-circle-o"}`} />
      </button>
    );
  } else {
    const onOpenChanged = (isOpen: boolean) => {
      if (isOpen === false)
        getStore.dispatch({
          type: ADD_SERVER_MODAL_CONFIRM_PROCEED,
          payload: { confirmProceed: false }
        });
      else
        getStore.dispatch({
          type: ADD_SERVER_MODAL_CONFIRM_PROCEED,
          payload: { confirmProceed: true }
        });
    };

    const confirmButton = (
      <WindowClickListener forceOpen={confirmProceed} onOpenChanged={onOpenChanged}>
        <ConfirmButton disabled={disabled} showSpinner={showSpinner} />
      </WindowClickListener>
    );

    return confirmButton;
  }
};

const SelectInnerComponent = ({ ...props }) => {
  switch (props.step) {
    case ADD_SERVER_MODAL_QUERY_SERVER_STEP:
      return <QueryServersComponent {...props} />;
    case ADD_SERVER_MODAL_SELECT_PROFILE_STEP:
      return <SelectServerProfileComponent {...props} />;
    case ADD_SERVER_MODAL_COMPLETE_STEP:
      return <AddServerCompleteComponent {...props} />;
    default:
      return <InterstitialComponent title={props.title} message={props.message} />;
  }
};

const CloseX = ({ visible }) => {
  if (visible === false) return null;

  return (
    <button type="button" class="close" onClick={linkEvent(null, onClose)}>
      <i class="fa fa-times" />
    </button>
  );
};

const CloseButton = ({ visible }) => {
  if (visible === false) return null;

  return (
    <button
      class="btn btn-danger"
      onClick={() => {
        getStore.dispatch({
          type: ADD_SERVER_MODAL_CLOSE_MODAL,
          payload: {}
        });
      }}
    >
      Close
    </button>
  );
};

class AddServerModal extends Component {
  props: AddServerModalPayloadT;

  onEnterOrEscape = (e: SyntheticKeyboardEvent<HTMLBodyElement>) => {
    if (
      e.key === "Enter" &&
      this.props.step === ADD_SERVER_MODAL_QUERY_SERVER_STEP &&
      this.props.proceedButton.disabled === false
    )
      if (this.props.confirmProceed === false)
        getStore.dispatch({
          type: ADD_SERVER_MODAL_CONFIRM_PROCEED,
          payload: { confirmProceed: true }
        });
      else {
        getStore.dispatch({
          type: ADD_SERVER_MODAL_CONFIRM_PROCEED,
          payload: { confirmProceed: false }
        });
        getStore.dispatch({
          type: ADD_SERVER_MODAL_START_TRANSITION,
          payload: {}
        });
      }
    else if (e.key === "Escape" && this.props.closeX === true)
      getStore.dispatch({
        type: ADD_SERVER_MODAL_CLOSE_MODAL,
        payload: {}
      });
  };

  render() {
    return (
      <>
        <WindowKeyListener onKeyDownHandler={this.onEnterOrEscape} />
        <Modal visible={true} moreClasses={["add-server-modal"]}>
          <Header class="modal-header">
            <CloseX visible={this.props.closeX} />
            <h4 class="modal-title">{this.props.modalTitle}</h4>
            <span class="icon-wrap tooltip-container tooltip-hover">
              <i class="fa fa-question-circle" />
              <Tooltip size={"large"} direction={"bottom"} message={this.props.modalTooltip} />
            </span>
          </Header>
          <Body moreClasses={["add-server-step"]}>
            <SelectInnerComponent {...this.props} />
          </Body>
          <Footer class="modal-footer">
            <>
              <ProceedButton
                {...this.props.proceedButton}
                step={this.props.step}
                confirmProceed={this.props.confirmProceed}
              />
              <CloseButton visible={this.props.closeButton} />
            </>
          </Footer>
        </Modal>
        <Backdrop visible={true} moreClasses={["step-modal-backdrop"]} />
      </>
    );
  }
}

export default TestHostComponent(AddServerModal);
