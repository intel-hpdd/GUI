// @flow

import { ConfirmActionModal } from "../../../../source/iml/action-dropdown/confirm-action-modal.js";
import { render } from "inferno";

describe("confirm action modal", () => {
  let body, div, cb, button;
  beforeEach(() => {
    cb = jest.fn();

    div = document.createElement("div");
    body = document.querySelector("body");
    if (body) body.appendChild(div);
  });

  describe("with no prompts", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={[]} cb={cb} />, div);
    });

    it("should render the modal", () => {
      expect(div).toMatchSnapshot();
    });
  });

  describe("with single prompt", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={["prompt1"]} cb={cb} />, div);
    });

    it("should render the modal", () => {
      expect(div).toMatchSnapshot();
    });
  });

  describe("with multiple prompts", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={["prompt1", "prompt2"]} cb={cb} />, div);
    });

    it("should render the modal", () => {
      expect(div).toMatchSnapshot();
    });
  });

  describe("interaction", () => {
    beforeEach(() => {
      render(<ConfirmActionModal message={"message"} prompts={["prompt1"]} cb={cb} />, div);
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
});
