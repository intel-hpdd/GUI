// @flow

import {
  SET_CONNECT_SSE,
  SET_DISCONNECT_SSE
} from "../../../../source/iml/disconnect-modal/disconnect-modal-reducer.js";

describe("sse stream", () => {
  let mockSseUrl, mockEventSource, mockGetStore, mockBackoff, backoff, eventSource, getStream, sse$;
  beforeEach(() => {
    mockSseUrl = "https://localhost:8443/messaging";
    jest.mock("../../../../source/iml/environment.js", () => ({
      SSE: mockSseUrl
    }));

    eventSource = {
      close: jest.fn(),
      onopen: jest.fn(),
      onerror: jest.fn(),
      onmessage: jest.fn()
    };
    mockEventSource = jest.fn(() => eventSource);
    jest.mock("../../../../source/iml/global.js", () => ({
      EventSource: mockEventSource
    }));

    mockGetStore = {
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    backoff = {
      reset: jest.fn(),
      duration: jest.fn(() => 10)
    };

    mockBackoff = jest.fn(() => backoff);
    jest.mock("backo", () => mockBackoff);

    getStream = require("../../../../source/iml/sse/sse-stream.js").default;
    sse$ = getStream();
  });

  it("should push a message down the stream", done => {
    sse$.each(x => {
      expect(x).toEqual({
        key: "val"
      });
      done();
    });

    eventSource.onmessage({
      data: JSON.stringify({ key: "val" })
    });
  });

  it("should push an error if the json can't be parsed", done => {
    sse$
      .errors(e => {
        expect(e).toEqual(new SyntaxError("Unexpected end of JSON input"));
        done();
      })
      .each(() => {
        done.fail();
      });

    eventSource.onmessage({
      data: `{"key": "val}`
    });
  });

  describe("when an error occurs on the stream", () => {
    let e;
    beforeEach(() => {
      e = {
        currentTarget: {
          readyState: 2
        }
      };
    });

    it("should handle the error", done => {
      sse$
        .errors(e => {
          expect(e).toEqual(new Error("An error occurred on the event source."));
          done();
        })
        .each(() => {
          done.fail();
        });

      eventSource.onerror(e);
    });

    it("should set the sse state to disconnected", done => {
      sse$
        .errors(() => {
          expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
          expect(mockGetStore.dispatch).toHaveBeenCalledWith({ type: SET_DISCONNECT_SSE, payload: {} });
          done();
        })
        .each(() => {
          done.fail();
        });

      eventSource.onerror(e);
    });

    it("should retrieve the backoff duration", done => {
      sse$
        .errors(() => {})
        .each(() => {
          done.fail();
        });

      eventSource.close.mockImplementation(() => {
        expect(backoff.duration).toHaveBeenCalledTimes(1);
        done();
      });

      eventSource.onerror(e);
    });

    it("should close the stream after the duration", done => {
      sse$
        .errors(() => {})
        .each(() => {
          done.fail();
        });

      eventSource.close.mockImplementation(() => {
        expect(eventSource.close).toHaveBeenCalledTimes(1);
        done();
      });

      eventSource.onerror(e);
    });
  });

  describe("when the stream is opened", () => {
    beforeEach(() => {
      sse$.each(() => {});

      eventSource.onopen();
    });

    it("should set sse to a connected status when the stream is opened", done => {
      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockGetStore.dispatch).toHaveBeenCalledWith({ type: SET_CONNECT_SSE, payload: {} });
      done();
    });

    it("should reset backoff", () => {
      expect(backoff.reset).toHaveBeenCalledTimes(1);
    });
  });
});
