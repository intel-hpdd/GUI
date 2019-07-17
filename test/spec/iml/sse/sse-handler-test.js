// @flow

import highland from "highland";

import { UPDATE_LOCKS_ACTION } from "../../../../source/iml/locks/locks-reducer.js";

describe("sse handler", () => {
  let mockGetSSEStream, s$, mockDispatch, samplePayload;

  beforeEach(() => {
    s$ = highland();

    mockGetSSEStream = jest.fn(() => s$);
    jest.mock("../../../../source/iml/sse/sse-stream.js", () => mockGetSSEStream);

    mockDispatch = jest.fn();
    jest.mock("../../../../source/iml/store/get-store.js", () => ({
      dispatch: mockDispatch
    }));

    require("../../../../source/iml/sse/sse-handler.js");

    samplePayload = {
      "62:1": [
        {
          action: "add",
          content_type_id: 62,
          description: "Start monitoring LNet on mds1.local",
          item_id: 1,
          job_id: 47,
          lock_type: "read"
        },
        {
          action: "add",
          content_type_id: 62,
          description: "Install packages on mds1.local",
          item_id: 1,
          job_id: 46,
          lock_type: "write"
        }
      ]
    };

    s$.write({ tag: "Locks", payload: samplePayload });
  });

  it("should dispatch the data", () => {
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: UPDATE_LOCKS_ACTION,
      payload: samplePayload
    });
  });
});
