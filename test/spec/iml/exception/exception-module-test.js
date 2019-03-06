// @flow

import highland from "highland";
import { render } from "inferno";

describe("exception module", () => {
  let mockGetStore, mockExceptionModal, stream;
  beforeEach(() => {
    mockGetStore = {
      select: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    mockExceptionModal = {
      ExceptionModalComponent: jest.fn(() => <span id="ExceptionModalComponent" />)
    };
    jest.mock("../../../../source/iml/exception/exception-handler.js", () => mockExceptionModal);
  });

  describe("with error", () => {
    let err;
    beforeEach(() => {
      err = new Error("oh no!");
      stream = highland();
      mockGetStore.select.mockReturnValueOnce(stream);

      require("../../../../source/iml/exception/exception-module.js");

      stream.write(err);
      stream.end();
    });

    afterEach(() => {
      const div = document.querySelector("div");
      render(null, div);
    });

    it("should launch the exception modal", () => {
      expect(document.querySelector("#ExceptionModalComponent")).not.toBeNull();
    });
  });

  describe("without an error", () => {
    beforeEach(() => {
      stream = highland();
      mockGetStore.select.mockReturnValueOnce(stream);

      require("../../../../source/iml/exception/exception-module.js");
      stream.write(null);
      stream.end();
    });

    it("should launch the exception modal", () => {
      expect(document.querySelector("#ExceptionModalComponent")).toBeNull();
    });
  });
});
