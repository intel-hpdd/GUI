// @flow

import { render } from "inferno";

const waitForDebounce = () => {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, 200);
  });
};

describe("PDSH component", () => {
  let el: HTMLElement,
    pdshPlaceholder: string,
    body: HTMLBodyElement,
    pdshInput: HTMLInputElement,
    hostnamePopoverIcon: HTMLElement,
    Pdsh;

  beforeEach(() => {
    pdshPlaceholder = "placeholder text";

    jest.mock("../../../../source/iml/environment.js", () => ({
      HELP_TEXT: {
        pdsh_placeholder: "pdsh placeholder text"
      }
    }));

    Pdsh = require("../../../../source/iml/pdsh/pdsh.js").default;

    body = (document.body: any);
    el = document.createElement("div");
    body.appendChild(el);

    render(<Pdsh pdshPlaceholder={pdshPlaceholder} />, el);
  });

  describe("general operation", () => {
    let inputEvent: KeyboardEvent;
    beforeEach(() => {
      inputEvent = new KeyboardEvent("input");
      pdshInput = (el.querySelector('input[name="pdsh"]'): any);
      hostnamePopoverIcon = (el.querySelector(".hostname-popover"): any);
    });

    describe("without input", () => {
      it("should render", () => {
        expect(el).toMatchSnapshot();
      });
    });

    describe("with input", () => {
      it("should render", async () => {
        pdshInput.value = "oss[1,2].local";
        pdshInput.dispatchEvent(inputEvent);

        await waitForDebounce();
        expect(el).toMatchSnapshot();
      });
    });

    describe("with input error", () => {
      it("should render", async () => {
        pdshInput.value = "oss[1,].local";
        pdshInput.dispatchEvent(inputEvent);

        await waitForDebounce();
        expect(el).toMatchSnapshot();
      });
    });

    describe("with initial value", () => {
      it("should render", () => {
        render(null, el);
        render(<Pdsh pdshPlaceholder={pdshPlaceholder} pdshInitial={"mds[1,2].local"} />, el);
        hostnamePopoverIcon = (el.querySelector(".hostname-popover"): any);
        hostnamePopoverIcon.click();

        expect(el).toMatchSnapshot();
      });
    });

    describe("clicking the hostname popover", () => {
      it("should render", async () => {
        pdshInput.value = "oss[1,2].local";
        pdshInput.dispatchEvent(inputEvent);
        hostnamePopoverIcon.click();

        await waitForDebounce();
        expect(el).toMatchSnapshot();
      });
    });

    describe("with debounce", () => {
      beforeEach(() => {
        pdshInput.value = "o";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "os";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "oss";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "oss[";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "oss[1";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "oss[1,],";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "oss[1,2";
        pdshInput.dispatchEvent(inputEvent);
        pdshInput.value = "oss[1,2]";
        pdshInput.dispatchEvent(inputEvent);
      });

      describe("before debounce fires", () => {
        it("should render with non-debounced data", () => {
          hostnamePopoverIcon.click();
          expect(el).toMatchSnapshot();
        });
      });

      describe("after debounce", () => {
        it("should render with debounced data after the timeout", async () => {
          hostnamePopoverIcon.click();

          await waitForDebounce();
          expect(el).toMatchSnapshot();
        });
      });
    });
  });
});
