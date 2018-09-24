import highland from "highland";

describe("server dispatch source", () => {
  let mockStore, mockSocketStream, mockDispatchSourceUtils, s;

  beforeEach(() => {
    const mockCacheInitialData = {
      host: ["host"]
    };

    mockStore = {
      dispatch: jest.fn()
    };

    s = highland();
    mockSocketStream = jest.fn(() => s);

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/environment.js", () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));
    mockDispatchSourceUtils = {
      canDispatch: jest.fn(() => true)
    };
    jest.mock("../../../../source/iml/dispatch-source-utils.js", () => mockDispatchSourceUtils);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    require("../../../../source/iml/server/server-dispatch-source.js");
  });

  beforeEach(() => {
    s.write({
      meta: "meta",
      objects: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    });
  });

  it("should make sure that the app can dispatch", () => {
    expect(mockDispatchSourceUtils.canDispatch).toHaveBeenCalledWith();
  });

  it("should dispatch cached servers into the store", () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_SERVER_ITEMS",
      payload: ["host"]
    });
  });

  it("should invoke the socket stream", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith("/host", {
      qs: { limit: 0 }
    });
  });

  it("should update servers when new items arrive from a persistent socket", () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_SERVER_ITEMS",
      payload: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    });
  });
});
