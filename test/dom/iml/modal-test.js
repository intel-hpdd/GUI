// @flow

import { render } from "inferno";
import { Modal, Header, Body, Footer, Backdrop } from "../../../source/iml/modal.js";
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
            <Backdrop moreClasses={["extra-backdrop-class"]} visible={true} zIndex={999} />
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
      render(<TestModal onAgree={onAgree} onDisagree={onDisagree} visible={false} />, root);
      el = root.querySelector(".modal");
    });
    it("should not exist on the element", () => {
      expect(el).toBeNull();
    });
  });
  describe("with modal visible", () => {
    beforeEach(() => {
      render(<TestModal onAgree={onAgree} onDisagree={onDisagree} visible={true} />, root);
      el = querySelector(root, ".modal");
    });

    it("should render", () => {
      expect(el).toMatchSnapshot();
    });
  });
});
