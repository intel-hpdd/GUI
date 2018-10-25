import Spinner from "../../../source/iml/spinner.js";
import { renderToSnapshot } from "../../test-utils.js";

describe("spinner", () => {
  let node;

  describe("when visible", () => {
    beforeEach(() => {
      node = renderToSnapshot(<Spinner display={true} />);
    });

    it("should render the spinner", () => {
      expect(node).toMatchSnapshot();
    });
  });

  describe("when not visible", () => {
    beforeEach(() => {
      node = renderToSnapshot(<Spinner display={false} />);
    });

    it("should not render the spinner", () => {
      expect(node).toMatchSnapshot();
    });
  });
});
