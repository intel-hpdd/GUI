// @flow

import exceptionModalReducer, {
  SHOW_EXCEPTION_MODAL_ACTION
} from "../../../../source/iml/exception/exception-modal-reducer.js";

describe("exceptionModalReducer", () => {
  let err: Error;

  beforeEach(() => {
    err = new Error("oh no!");
  });

  describe("receives a SHOW_EXCEPTION_MODAL_ACTION type", () => {
    it("should return the exception modal state", () => {
      const result = exceptionModalReducer(null, { type: SHOW_EXCEPTION_MODAL_ACTION, payload: err });
      expect(result).toEqual(err);
    });
  });
});
