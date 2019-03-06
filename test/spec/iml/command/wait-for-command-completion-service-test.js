import highland from "highland";

describe("wait-for-command-completion-service", () => {
  let mockGetCommandStream, mockGetStore, commandStream, spy, waitForCommandCompletion;

  beforeEach(() => {
    commandStream = highland();
    jest.spyOn(commandStream, "destroy");
    mockGetCommandStream = jest.fn(() => commandStream);

    jest.mock("../../../../source/iml/command/get-command-stream.js", () => mockGetCommandStream);

    mockGetStore = {
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    spy = jest.fn();

    waitForCommandCompletion = require("../../../../source/iml/command/wait-for-command-completion-service.js").default;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe("contains commands", () => {
    let responseWithCommands;

    beforeEach(() => {
      responseWithCommands = [{}];

      waitForCommandCompletion(false)(responseWithCommands).each(spy);
    });

    it("should call get command stream", () => {
      expect(mockGetCommandStream).toHaveBeenCalledWith([{}]);
    });

    it("should not call openCommandModal", () => {
      expect(mockGetStore.dispatch).not.toHaveBeenCalled();
    });

    describe("on finish", () => {
      let data;

      beforeEach(() => {
        data = [
          {
            complete: true
          }
        ];

        commandStream.write(data);
      });

      it("should destroy the command stream", () => {
        jest.runAllTimers();

        expect(commandStream.destroy).toHaveBeenCalledTimes(1);
      });

      it("should resolve the result", () => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith([
          {
            complete: true,
            state: "succeeded"
          }
        ]);
      });
    });
  });

  describe("opening the command modal", () => {
    let responseWithCommands;

    beforeEach(() => {
      responseWithCommands = [{}];

      waitForCommandCompletion(true)(responseWithCommands);
    });

    it("should open the command modal", () => {
      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockGetStore.dispatch).toHaveBeenCalledWith({
        type: "SHOW_COMMAND_MODAL_ACTION",
        payload: responseWithCommands
      });
    });
  });
});
