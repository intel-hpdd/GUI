// @flow

import { render } from "inferno";

describe("window key listener", () => {
  let WindowKeyListener, body, node, TestComponent, spy, keyEvt;
  beforeEach(() => {
    WindowKeyListener = require("../../../source/iml/window-key-listener.js").default;
    spy = jest.fn();
    keyEvt = new KeyboardEvent("keydown", { key: "Escape" });

    body = document.querySelector("body");
    node = document.createElement("div");
    if (body) body.appendChild(node);

    const onKeyDownHandler = (spy: Function) => (e: SyntheticKeyboardEvent<HTMLBodyElement>) => {
      if (e.key === "Escape") spy();
    };

    TestComponent = () => {
      return (
        <div>
          <WindowKeyListener onKeyDownHandler={onKeyDownHandler(spy)} />
          <span>Component Test</span>
        </div>
      );
    };

    render(<TestComponent />, node);
  });

  afterEach(() => {
    render(null, node);
    if (body) body.removeChild(node);
  });

  it("should not call the spy if escape isn't pressed", () => {
    expect(spy).not.toHaveBeenCalledTimes(1);
  });

  it("should call the spy if escape is pressed", () => {
    window.dispatchEvent(keyEvt);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
