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

    jest.spyOn(window, "clearTimeout");

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

    [0, 2].forEach(readyState => {
      describe(`with a ready state of ${readyState}`, () => {
        beforeEach(() => {
          e = {
            currentTarget: {
              readyState
            }
          };
        });

        it("should dispatch the disconnect sse modal", () => {
          sse$
            .errors(() => {
              throw new Error("should not have gone in the errors block.");
            })
            .each(() => {});

          eventSource.onerror(e);
          expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
          expect(mockGetStore.dispatch).toHaveBeenCalledWith({ type: SET_DISCONNECT_SSE, payload: {} });
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

        ["onopen", "onerror", "onmessage"].forEach(fn => {
          it(`should set ${fn} to null`, done => {
            sse$
              .errors(() => {})
              .each(() => {
                done.fail();
              });

            eventSource.close.mockImplementation(() => {
              expect(eventSource[fn]).toBe(null);
              done();
            });

            eventSource.onerror(e);
          });
        });
      });
    });

    describe("with a ready state of 1", () => {
      beforeEach(() => {
        e = {
          currentTarget: {
            readyState: 1
          }
        };
      });

      it("should push an error", done => {
        sse$
          .errors(e => {
            expect(e).toEqual(new Error("An error occurred while the server send event was connected."));
            done();
          })
          .each(() => {
            done.fail();
          });

        eventSource.onerror(e);
      });
    });
  });

  describe("when the stream is opened", () => {
    beforeEach(() => {
      sse$.each(() => {});

      eventSource.onopen();
    });

    it("should clear the timeout", () => {
      expect(window.clearTimeout).toHaveBeenCalledTimes(1);
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

  describe("When backoff occurs", () => {
    let e;
    beforeEach(() => {
      e = {
        currentTarget: {
          readyState: 2
        }
      };
    });

    it("should trun the next iteration", done => {
      let count = 0;
      mockEventSource.mockImplementation(() => {
        count++;
        if (count === 1) {
          return eventSource;
        } else {
          expect(mockEventSource).toHaveBeenCalledTimes(2);
          done();
        }
      });
      sse$.errors(() => {}).each(() => {});

      eventSource.onerror(e);
    });
  });
});
