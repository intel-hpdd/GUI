// @flow

import Inferno from "inferno";
import { Modal, Header, Body, Footer } from "../../../source/iml/modal.js";
import { querySelector } from "../../../source/iml/dom-utils.js";

describe("Modal test", () => {
  let root: HTMLDivElement, onAgree, onDisagree, TestModal, el: HTMLElement;
  beforeEach(() => {
    root = document.createElement("div");
    querySelector(document, "body").appendChild(root);
    onAgree = jest.fn();
    onDisagree = jest.fn();
    TestModal = ({ onAgree, onDisagree, visible }) => {
      return (
        <div class="modal-open">
          <Modal moreClasses={["test-modal"]} visible={visible}>
            <Header class="modal-header">
              <h3 class="modal-title">This is the header</h3>
            </Header>
            <Body>
              <p>Test content</p>
            </Body>
            <Footer class="modal-footer">
              <button class="btn btn-success" onClick={onAgree}>
                Agree
              </button>
              <button class="btn btn-danger" onClick={onDisagree}>
                Do Not Agree
              </button>
            </Footer>
          </Modal>
        </div>
      );
    };
  });
  afterEach(() => {
    querySelector(document, "body").removeChild(root);
  });
  describe("with modal not visible", () => {
    let el: ?HTMLElement;

    beforeEach(() => {
      Inferno.render(<TestModal onAgree={onAgree} onDisagree={onDisagree} visible={false} />, root);
      el = root.querySelector(".modal");
    });
    it("should not exist on the element", () => {
      expect(el).toBeNull();
    });
  });
  describe("with modal visible", () => {
    beforeEach(() => {
      Inferno.render(<TestModal onAgree={onAgree} onDisagree={onDisagree} visible={true} />, root);
      el = querySelector(root, ".modal");
    });
    it("should have the extra classes", () => {
      expect(el.classList).toContain("test-modal");
    });
    it("should have the modal class", () => {
      expect(el.classList).toContain("modal");
    });
    it("should have the fade class", () => {
      expect(el.classList).toContain("fade");
    });
    it("should have the in class", () => {
      expect(el.classList).toContain("in");
    });
    it("should set the document role on the modal-dialog", () => {
      expect(querySelector(el, ".modal-dialog").getAttribute("role")).toEqual("document");
    });
    it("should have a modal-content container", () => {
      expect(querySelector(el, ".modal-content")).not.toBeNull();
    });
    describe("modal header", () => {
      let modalHeader: HTMLElement;
      beforeEach(() => {
        modalHeader = querySelector(el, ".modal-header");
      });
      it("should exist", () => {
        expect(modalHeader).not.toBeNull();
      });
      it("should have the title", () => {
        expect(querySelector(modalHeader, "h3").textContent).toEqual("This is the header");
      });
    });
    describe("modal body", () => {
      let modalBody: HTMLElement;
      beforeEach(() => {
        modalBody = querySelector(el, ".modal-body");
      });
      it("should exist", () => {
        expect(modalBody).not.toBeNull();
      });
      it("should render the content component", () => {
        expect(querySelector(modalBody, "p").textContent).toEqual("Test content");
      });
    });
    describe("modal footer", () => {
      let modalFooter, successButton, dangerButton;
      beforeEach(() => {
        modalFooter = querySelector(el, ".modal-footer");
        successButton = querySelector(modalFooter, "button.btn-success");
        dangerButton = querySelector(modalFooter, "button.btn-danger");
      });
      it("should exist", () => {
        expect(modalFooter).not.toBeNull();
      });
      it("should have a success button", () => {
        expect(successButton.textContent).toEqual("Agree");
      });
      it("should call onAgree when the success button is clicked", () => {
        successButton.click();
        expect(onAgree).toHaveBeenCalledTimes(1);
      });
      it("should have a danger button", () => {
        expect(dangerButton.textContent).toEqual("Do Not Agree");
      });
      it("should call onDisagree when the danger button is clicked", () => {
        dangerButton.click();
        expect(onDisagree).toHaveBeenCalledTimes(1);
      });
    });
  });
});
