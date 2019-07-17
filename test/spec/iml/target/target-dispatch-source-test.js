describe("target dispatch source", () => {
  let mockStore;

  beforeEach(() => {
    const mockCacheInitialData = { target: [{ id: 1, name: "targets" }] };

    mockStore = { dispatch: jest.fn() };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/environment.js", () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));

    require("../../../../source/iml/target/target-dispatch-source.js");
  });

  it("should dispatch cached targets into the store", () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_TARGET_ITEMS",
      payload: { 1: { id: 1, name: "targets" } }
    });
  });
});
