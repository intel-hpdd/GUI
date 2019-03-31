describe("app states", () => {
  let spy, appState, mockGlobal, mockAppResolves;
  beforeEach(() => {
    spy = jest.fn();

    mockGlobal = {
      wasm_bindgen: jest.fn()
    };
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    mockAppResolves = {
      sseResolves: jest.fn()
    };
    jest.mock("../../../../source/iml/app/app-resolves.js", () => mockAppResolves);

    appState = require("../../../../source/iml/app/app-states.js").appState;
  });

  it("should create the state", () => {
    expect(appState).toMatchSnapshot();
  });

  it("should have an alertStream resolve", () => {
    appState.resolve.alertStream[1](spy);
  });

  it("should have a notificationStream resolve", () => {
    appState.resolve.notificationStream[1](spy);
  });

  it("should have a wasm resolve", () => {
    appState.resolve.wasm();

    expect(mockGlobal.wasm_bindgen).toHaveBeenCalledTimes(1);
    expect(mockGlobal.wasm_bindgen).toHaveBeenCalledWith("/wasm-components/package_bg.wasm");
  });

  it("should have a sse resolve", () => {
    expect(appState.resolve.sse).toBe(mockAppResolves.sseResolves);
  });
});
