import highland from "highland";
import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("get copytool stream", () => {
  let mockSocketStream, stream, getCopytoolStream;

  beforeEach(() => {
    stream = highland();

    mockSocketStream = jest.fn(() => stream);

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    const mod = require("../../../../source/iml/hsm/get-copytool-stream.js");

    getCopytoolStream = mod.default;
  });

  it("should get a stream", () => {
    getCopytoolStream();

    expect(mockSocketStream).toHaveBeenCalledOnceWith("/copytool", {
      qs: {
        limit: 0
      },
      jsonMask:
        "objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)"
    });
  });

  it("should set status to state if not started", async () => {
    stream.write({
      objects: [
        {
          state: "finished"
        }
      ]
    });

    expect(await streamToPromise(getCopytoolStream())).toEqual([
      {
        state: "finished",
        status: "finished"
      }
    ]);
  });

  it("should set status to idle if no active operations", async () => {
    stream.write({
      objects: [
        {
          state: "started",
          active_operations_count: 0
        }
      ]
    });

    expect(await streamToPromise(getCopytoolStream())).toEqual([
      {
        active_operations_count: 0,
        state: "started",
        status: "idle"
      }
    ]);
  });

  it("should set status to working", async () => {
    stream.write({
      objects: [
        {
          state: "started",
          active_operations_count: 1
        }
      ]
    });

    expect(await streamToPromise(getCopytoolStream())).toEqual([
      {
        active_operations_count: 1,
        state: "started",
        status: "working"
      }
    ]);
  });
});
