// @flow

import { render } from "inferno";
import global from "../../../../source/iml/global.js";
import DisconnectModal from "../../../../source/iml/disconnect-modal/disconnect-modal.js";

describe("disconnect modal", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("div");
    if (global.document.body) global.document.body.appendChild(el);

    render(<DisconnectModal />, el);
  });

  afterEach(() => {
    render(null, el);
    if (global.document.body) global.document.body.removeChild(el);
  });

  it("should generate the modal", () => {
    expect(el).toMatchSnapshot();
  });
});
