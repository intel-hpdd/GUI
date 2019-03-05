// @flow

describe("fetch api", () => {
  let mockGlobal, mockGetStore, fetchApi, r;
  beforeEach(() => {
    mockGlobal = {
      fetch: jest.fn()
    };
    jest.mock("../../../source/iml/global.js", () => mockGlobal);

    mockGetStore = {
      dispatch: jest.fn()
    };
    jest.mock("../../../source/iml/store/get-store.js", () => mockGetStore);

    fetchApi = require("../../../source/iml/fetch-api.js").default;
  });

  describe("with valid json", () => {
    let data;
    beforeEach(async () => {
      data = { x: "val1", y: "val2" };
      mockGlobal.fetch.mockReturnValueOnce(
        Promise.resolve({
          json: () => data
        })
      );

      r = await fetchApi("/api/action");
    });

    it("should call fetch", () => {
      expect(mockGlobal.fetch).toHaveBeenCalledTimes(1);
      expect(mockGlobal.fetch).toHaveBeenCalledWith("/api/action", {});
    });

    it("should return the data", () => {
      expect(r).toEqual(data);
    });

    it("should not dispatch the exception modal", () => {
      expect(mockGetStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("with an error", () => {
    let err;
    beforeEach(async () => {
      err = new Error("oh no!");
      mockGlobal.fetch.mockReturnValueOnce(Promise.reject(err));

      r = await fetchApi("/api/action");
    });

    it("should dispatch the exception modal", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockGetStore.dispatch).toHaveBeenCalledWith({
        type: "SHOW_EXCEPTION_MODAL_ACTION",
        payload: err
      });
    });

    it("should return undefined", () => {
      expect(r).toBeUndefined();
    });
  });
});
