// @flow

import { render } from "inferno";
import getStore from "../store/get-store.js";
import { CLEAR_CONFIRM_ACTION, type ConfirmActionPayloadT } from "./confirm-action-reducer.js";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";
import { ConfirmActionStates, ConfirmActionModal } from "./confirm-action-modal.js";
import { type Command } from "../command/command-types.js";

import type { HighlandStreamT } from "highland";

const confirmModalCb = (body: HTMLElement, container: HTMLElement, action: () => HighlandStreamT<*>) => (
  selectedAction: string
) => {
  render(null, container);
  body.removeChild(container);

  switch (selectedAction) {
    case ConfirmActionStates.CANCEL:
      getStore.dispatch({
        type: CLEAR_CONFIRM_ACTION,
        payload: {}
      });
      break;
    case ConfirmActionStates.CONFIRM_AND_SKIP:
      action().each(() => {
        getStore.dispatch({
          type: CLEAR_CONFIRM_ACTION,
          payload: {}
        });
      });
      break;
    case ConfirmActionStates.CONFIRM:
      action().each((x: Command | { command: Command }) => {
        getStore.dispatch({
          type: SHOW_COMMAND_MODAL_ACTION,
          payload: [x.command || x]
        });
      });
  }
};

getStore.select("confirmAction").each(({ action, message, prompts, required }: ConfirmActionPayloadT) => {
  if (required) {
    const body = document.querySelector("body");
    const container = document.createElement("div");
    if (body) body.appendChild(container);

    render(
      <ConfirmActionModal
        message={message}
        prompts={[...prompts]}
        cb={confirmModalCb((body: any), container, action)}
      />,
      container
    );
  } else if (action != null) {
    action().each((x: Command | { command: Command }) => {
      getStore.dispatch({
        type: SHOW_COMMAND_MODAL_ACTION,
        payload: [x.command || x]
      });
    });
  }
});
