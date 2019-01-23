// @flow

describe("sse stream", () => {
  let mockSseUrl, mockEventSource, eventSource, getStream, sse$;
  beforeEach(() => {
    mockSseUrl = "https://localhost:8443/messaging";
    jest.mock("../../../../source/iml/environment.js", () => ({
      SSE: mockSseUrl
    }));

    eventSource = {};
    mockEventSource = jest.fn(() => eventSource);
    jest.mock("../../../../source/iml/global.js", () => ({
      EventSource: mockEventSource
    }));

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

  it("should handle an error on the event source", done => {
    sse$
      .errors(e => {
        expect(e).toEqual(new Error("oh nooooos"));
        done();
      })
      .each(() => {
        done.fail();
      });

    eventSource.onerror(new Error("oh nooooos"));
  });
});
