import {
  SET_CONNECT_REALTIME,
  SET_DISCONNECT_REALTIME
} from "../../../../source/iml/disconnect-modal/disconnect-modal-reducer.js";

describe("socket worker", () => {
  let worker, mockGetWebWorker, socketWorker, mockGetStore;

  beforeEach(() => {
    worker = {
      addEventListener: jest.fn()
    };

    mockGetWebWorker = jest.fn(() => worker);

    mockGetStore = {
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);
    jest.mock("../../../../source/iml/socket-worker/get-web-worker.js", () => mockGetWebWorker);
    jest.mock("../../../../source/iml/environment.js", () => ({
      STATIC_URL: "/gui/"
    }));

    const socketWorkerModule = require("../../../../source/iml/socket-worker/socket-worker.js");

    socketWorker = socketWorkerModule.default;
  });

  it("should create a worker with a remote script", () => {
    expect(mockGetWebWorker).toHaveBeenCalledOnceWith(`/gui/node_modules/socket-worker/dist/bundle.js`);
  });

  it("should register a message handler", () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith("message", expect.any(Function));
  });

  it("should register an error handler", () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith("error", expect.any(Function));
  });

  it("should return the worker", () => {
    expect(worker).toBe(socketWorker);
  });

  it("should throw on error", () => {
    const err = new Error("boom!");
    expect(worker.addEventListener.mock.calls[1][1].bind(null, err)).toThrow("boom!");
  });

  describe("message handling", () => {
    let handler;

    beforeEach(() => {
      handler = worker.addEventListener.mock.calls[0][1];
    });

    describe("reconnecting", () => {
      let ev;

      beforeEach(() => {
        ev = {
          data: { type: "reconnecting" }
        };

        handler(ev);
      });

      it("should emit open on disconnectListener", () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
        expect(mockGetStore.dispatch).toHaveBeenCalledWith({ type: SET_DISCONNECT_REALTIME, payload: {} });
      });
    });

    describe("reconnect", () => {
      let ev;

      beforeEach(() => {
        ev = {
          data: { type: "reconnecting" }
        };

        handler(ev);

        ev.data.type = "reconnect";
        handler(ev);
      });

      it("should emit close on disconnectListener", () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledTimes(2);
        expect(mockGetStore.dispatch).toHaveBeenCalledWith({ type: SET_CONNECT_REALTIME, payload: {} });
      });
    });
  });
});
