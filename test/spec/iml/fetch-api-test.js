// @flow

describe("fetch api", () => {
  let mockGlobal, fetchApi;
  beforeEach(() => {
    mockGlobal = {
      fetch: jest.fn()
    };

    jest.mock("../../../source/iml/global.js", () => mockGlobal);

    fetchApi = require("../../../source/iml/fetch-api.js").default;
  });

  describe("with valid json", () => {
    beforeEach(() => {
      mockGlobal.fetch.mockReturnValueOnce(
        Promise.resolve({
          json: () => ({ x: "val1", y: "val2" })
        })
      );

      fetchApi("/api/action");
    });

    it("should call fetch", () => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/api/fetch", {});
    });
  });
});
