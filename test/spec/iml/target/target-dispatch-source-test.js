import highland from "highland";

describe("target dispatch source", () => {
  let mockStore, stream, mockSocketStream, mockDispatchSourceUtils;

  beforeEach(() => {
    const mockCacheInitialData = { target: ["targets"] };
    stream = highland();
    mockSocketStream = jest.fn(() => stream);
    mockStore = { dispatch: jest.fn() };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/environment.js", () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));
    mockDispatchSourceUtils = {
      canDispatch: jest.fn(() => true)
    };
    jest.mock("../../../../source/iml/dispatch-source-utils.js", () => mockDispatchSourceUtils);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    require("../../../../source/iml/target/target-dispatch-source.js");
  });

  it("should make sure that the app can dispatch", () => {
    expect(mockDispatchSourceUtils.canDispatch).toHaveBeenCalledWith();
  });

  it("should dispatch cached targets into the store", () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_TARGET_ITEMS",
      payload: ["targets"]
    });
  });

  it("should setup a persistent socket to /targets", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith("/target", {
      qs: { dehydrate__volume: false, limit: 0 }
    });
  });

  it("should update targets when new items arrive from a persistent socket", () => {
    stream.write({ objects: ["more targets"] });
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_TARGET_ITEMS",
      payload: ["more targets"]
    });
  });
});
