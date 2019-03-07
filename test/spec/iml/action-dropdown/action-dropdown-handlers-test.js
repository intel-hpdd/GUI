// @flow

import highland from "highland";

import { CLEAR_CONFIRM_ACTION } from "../../../../source/iml/action-dropdown/confirm-action-reducer.js";

describe("action dropdown handler", () => {
  let mockConfirmActionModal, mockGetStore, command;
  let confirmAction$, action;
  beforeEach(() => {
    mockConfirmActionModal = {
      ConfirmActionStates: {
        CANCEL: "cancel",
        CONFIRM: "confirm",
        CONFIRM_AND_SKIP: "confirm_and_skip"
      },
      ConfirmActionModal: jest.fn()
    };
    jest.mock("../../../../source/iml/action-dropdown/confirm-action-modal.js", () => mockConfirmActionModal);

    confirmAction$ = highland();
    mockGetStore = {
      select: jest.fn(() => confirmAction$),
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    command = {};
    action = jest.fn(() => highland([command]));
    require("../../../../source/iml/action-dropdown/action-dropdown-handlers.js");
  });

  it("should select the confirmAction store", () => {
    expect(mockGetStore.select).toHaveBeenCalledTimes(1);
    expect(mockGetStore.select).toHaveBeenCalledWith("confirmAction");
  });

  describe("when required the modal", () => {
    beforeEach(() => {
      confirmAction$.write({
        action,
        message: "message",
        prompts: [],
        required: true,
        label: "label"
      });
    });

    it("should render", () => {
      expect(mockConfirmActionModal.ConfirmActionModal).toHaveBeenCalledTimes(1);
      expect(mockConfirmActionModal.ConfirmActionModal).toHaveBeenCalledWith(
        {
          cb: expect.any(Function),
          message: "message",
          prompts: []
        },
        {}
      );
    });

    it("should not show the command modal", () => {
      expect(mockGetStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when not required", () => {
    beforeEach(() => {
      confirmAction$.write({
        action,
        message: "message",
        prompts: [],
        required: false,
        label: "label"
      });
    });

    it("should not call the ConfirmActionModal", () => {
      expect(mockConfirmActionModal.ConfirmActionModal).not.toHaveBeenCalled();
    });

    it("should show the command modal", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockGetStore.dispatch).toHaveBeenCalledWith({
        type: "SHOW_COMMAND_MODAL_ACTION",
        payload: [command]
      });
    });
  });

  describe("callback", () => {
    let cb;
    beforeEach(() => {
      confirmAction$.write({
        action,
        message: "message",
        prompts: [],
        required: true,
        label: "label"
      });

      cb = mockConfirmActionModal.ConfirmActionModal.mock.calls[0][0].cb;
    });

    describe("cancel action", () => {
      beforeEach(() => {
        cb("cancel");
      });

      it("should not invoke the action", () => {
        expect(action).not.toHaveBeenCalled();
      });

      it("should close the confirm action modal", () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
        expect(mockGetStore.dispatch).toHaveBeenCalledWith({
          type: CLEAR_CONFIRM_ACTION,
          payload: {}
        });
      });
    });

    describe("confirm and skip action", () => {
      beforeEach(() => {
        cb("confirm_and_skip");
      });

      it("should not invoke the action", () => {
        expect(action).toHaveBeenCalledTimes(1);
      });

      it("should close the confirm action modal", () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
        expect(mockGetStore.dispatch).toHaveBeenCalledWith({
          type: CLEAR_CONFIRM_ACTION,
          payload: {}
        });
      });
    });

    describe("confirm action", () => {
      beforeEach(() => {
        cb("confirm");
      });

      it("should invoke the action", () => {
        expect(action).toHaveBeenCalledTimes(1);
      });

      it("should show the command modal", () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
        expect(mockGetStore.dispatch).toHaveBeenCalledWith({
          type: "SHOW_COMMAND_MODAL_ACTION",
          payload: [command]
        });
      });
    });
  });
});
