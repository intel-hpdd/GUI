import highland from "highland";
describe("alert indicator dispatch source", () => {
  let mockStore, stream, mockSocketStream, mockDispatchSourceUtils;
  beforeEach(() => {
    mockStore = { dispatch: jest.fn() };
    stream = highland();
    jest.spyOn(stream, "destroy");
    mockSocketStream = jest.fn(() => stream);
    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);
    mockDispatchSourceUtils = {
      canDispatch: jest.fn(() => true)
    };
    jest.mock("../../../../source/iml/dispatch-source-utils.js", () => mockDispatchSourceUtils);

    require("../../../../source/iml/alert-indicator/alert-indicator-dispatch-source.js");
  });

  it("should make sure that the app can dispatch", () => {
    expect(mockDispatchSourceUtils.canDispatch).toHaveBeenCalledWith();
  });

  it("should request alerts", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith("/alert/", {
      jsonMask: "objects(affected,message)",
      qs: { limit: 0, active: true }
    });
  });
  it("should update alerts when new items arrive from a persistent socket", () => {
    stream.write({ objects: ["more alerts"] });
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: "ADD_ALERT_INDICATOR_ITEMS",
      payload: ["more alerts"]
    });
  });
});
