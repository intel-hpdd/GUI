import highland from "highland";

describe("get the command stream", () => {
  let mockSocketStream, stream, getCommandStream, getCommandStreamModule, commandList, result;

  beforeEach(() => {
    stream = highland();
    mockSocketStream = jest.fn(() => stream);

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    getCommandStreamModule = require("../../../../source/iml/command/get-command-stream.js");

    getCommandStream = getCommandStreamModule.default;

    commandList = wrap({}, {}).objects;
    result = getCommandStream(commandList);
  });

  it("should invoke socketStream", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith("/command", {
      qs: {
        id__in: [1, 2]
      }
    });
  });

  it("should return a stream", () => {
    expect(highland.isStream(result)).toBe(true);
  });

  it("should write passed data to the stream", () => {
    result.each(x => {
      expect(x).toEqual([
        {
          id: 1,
          logs: "",
          jobs: []
        },
        {
          id: 2,
          logs: "",
          jobs: []
        }
      ]);
    });
  });

  function wrap() {
    const commands = [].slice.call(arguments);

    return {
      objects: commands.map((command, index) => {
        return Object.assign(
          {
            id: index + 1,
            logs: "",
            jobs: []
          },
          command
        );
      })
    };
  }
});
