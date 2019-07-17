describe("file system dispatch source", () => {
  let mockStore;

  beforeEach(() => {
    const mockCacheInitialData = {
      filesystem: [{ id: 1, name: "filesystem" }]
    };

    mockStore = {
      dispatch: jest.fn()
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/environment.js", () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));

    require("../../../../source/iml/file-system/file-system-dispatch-source.js");
  });

  it("should dispatch cached file systems into the store", () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_FS_ITEMS",
      payload: { 1: { id: 1, name: "filesystem" } }
    });
  });
});
