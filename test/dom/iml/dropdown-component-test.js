// @flow
import { render } from "inferno";
import Dropdown from "../../../source/iml/dropdown-component.js";
import { renderToSnapshot } from "../../test-utils.js";
import { querySelector } from "../../../source/iml/dom-utils.js";

const twoChildrenError = new Error("DropdownContainer expects two children");

describe("Dropdown DOM Tests", () => {
  let root, clickHandler;

  beforeEach(() => {
    root = document.createElement("div");
    querySelector(document, "body").appendChild(root);

    clickHandler = jest.fn();
  });

  afterEach(() => {
    querySelector(document, "body").removeChild(root);
  });

  it("should throw if there are no children", () => {
    expect(() => render(<Dropdown isOpen={false} toggleOpen={clickHandler} />, root)).toThrow(twoChildrenError);
  });

  it("should open on click", () => {
    render(
      <Dropdown isOpen={false} toggleOpen={clickHandler}>
        <button />
        <ul />
      </Dropdown>,
      root
    );

    querySelector(root, "button").click();
    expect(clickHandler).toHaveBeenCalledOnceWith(expect.any(Object));
  });

  it("should respond to isOpen", () => {
    expect(
      renderToSnapshot(
        <Dropdown isOpen={true} toggleOpen={clickHandler}>
          <button />
          <ul />
        </Dropdown>
      )
    ).toMatchSnapshot();
  });
});
