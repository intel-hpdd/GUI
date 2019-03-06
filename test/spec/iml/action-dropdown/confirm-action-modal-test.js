// @flow

import { render } from "inferno";
import highland from "highland";

describe("confirm action modal", () => {
  let body, div, cb, button, ConfirmActionModal, modalStack$, mockGetStore;
  beforeEach(() => {
    cb = jest.fn();

    modalStack$ = highland();
    jest.spyOn(modalStack$, "end");
    mockGetStore = {
      select: jest.fn(() => modalStack$),
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    ConfirmActionModal = require("../../../../source/iml/action-dropdown/confirm-action-modal.js").ConfirmActionModal;

    div = document.createElement("div");
    body = document.querySelector("body");
    if (body) body.appendChild(div);
  });

  describe("with no prompts", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={[]} cb={cb} />, div);
    });

    afterEach(() => {
      render(null, div);
      if (body) body.removeChild(div);
    });

    it("should render the modal", () => {
      expect(div).toMatchSnapshot();
    });
  });

  describe("with single prompt", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={["prompt1"]} cb={cb} />, div);
    });

    afterEach(() => {
      render(null, div);
      if (body) body.removeChild(div);
    });

    it("should render the modal", () => {
      expect(div).toMatchSnapshot();
    });
  });

  describe("with multiple prompts", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={["prompt1", "prompt2"]} cb={cb} />, div);
    });

    afterEach(() => {
      render(null, div);
      if (body) body.removeChild(div);
    });

    it("should render the modal", () => {
      expect(div).toMatchSnapshot();
    });
  });

  describe("interaction", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={["prompt1"]} cb={cb} />, div);
    });

    afterEach(() => {
      render(null, div);
      if (body) body.removeChild(div);
    });

    describe("Confirming", () => {
      beforeEach(() => {
        button = div.querySelector(".modal-footer button:first-of-type");
        if (button) button.click();
      });

      it("should invoke the callback with confirm type", () => {
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith("confirm");
      });
    });

    describe("Confirming and skipping", () => {
      let a;
      beforeEach(() => {
        button = div.querySelector(".modal-footer button.dropdown-toggle");
        if (button) button.click();
        a = div.querySelector(".modal-footer a");
        if (a) a.click();
      });

      it("should invoke the callback with confirm and skip type", () => {
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith("confirm_and_skip");
      });
    });

    describe("Canceling", () => {
      beforeEach(() => {
        button = div.querySelector(".modal-footer button.btn-danger");
        if (button) button.click();
      });

      it("should invoke the callback with cancel type", () => {
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith("cancel");
      });
    });
  });

  describe("on destroy", () => {
    beforeEach(done => {
      cb.mockImplementation(() => {
        render(null, div);
        if (body) body.removeChild(div);
        done();
      });

      render(<ConfirmActionModal message={"message"} prompts={["prompt1", "prompt2"]} cb={cb} />, div);
      modalStack$.write(["CONFIRM_ACTION_COMMAND_MODAL_NAME"]);

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    it("should dispatch with the MODAL_STACK_REMOVE_MODAL type", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(2);
      expect(mockGetStore.dispatch).lastCalledWith({
        type: "MODAL_STACK_REMOVE_MODAL",
        payload: "CONFIRM_ACTION_COMMAND_MODAL_NAME"
      });
    });

    it("should end the modalStack$", () => {
      expect(modalStack$.end).toHaveBeenCalledTimes(1);
    });
  });
});
