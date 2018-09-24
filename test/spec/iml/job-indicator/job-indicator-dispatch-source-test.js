import highland from "highland";

describe("job indicator dispatch source", () => {
  let mockStore, mockSocketStream, mockDispatchSourceUtils, stream;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn()
    };

    stream = highland();
    mockSocketStream = jest.fn(() => stream);

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);
    mockDispatchSourceUtils = {
      canDispatch: jest.fn(() => true)
    };
    jest.mock("../../../../source/iml/dispatch-source-utils.js", () => mockDispatchSourceUtils);

    require("../../../../source/iml/job-indicator/job-indicator-dispatch-source.js");
  });

  it("should make sure that the app can dispatch", () => {
    expect(mockDispatchSourceUtils.canDispatch).toHaveBeenCalledWith();
  });

  it("should request pending and tasked jobs", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith("/job/", {
      jsonMask: "objects(write_locks,read_locks,description)",
      qs: {
        limit: 0,
        state__in: ["pending", "tasked"]
      }
    });
  });

  it("should pluck objects out of the stream", () => {
    stream.write({
      meta: "meta",
      objects: [{ foo: "bar" }]
    });

    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_JOB_INDICATOR_ITEMS",
      payload: [{ foo: "bar" }]
    });
  });
});
