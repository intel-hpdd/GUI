describe("server dispatch source", () => {
  let mockStore;

  beforeEach(() => {
    const mockCacheInitialData = {
      host: [{ id: 1, name: "host" }]
    };

    mockStore = {
      dispatch: jest.fn()
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/environment.js", () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));

    require("../../../../source/iml/server/server-dispatch-source.js");
  });

  it("should dispatch cached servers into the store", () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_SERVER_ITEMS",
      payload: { "1": { id: 1, name: "host" } }
    });
  });
});
