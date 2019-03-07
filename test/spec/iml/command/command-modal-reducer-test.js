import {
  SHOW_COMMAND_MODAL_ACTION,
  default as commandModalReducer
} from "../../../../source/iml/command/command-modal-reducer.js";
import deepFreeze from "@iml/deep-freeze";

describe("command modal reducer", () => {
  let commands;
  beforeEach(() => {
    commands = [
      {
        cancelled: false,
        created_at: "2019-03-05T17:23:14.773266",
        errored: false,
        id: 523,
        resource_uri: "/api/command/1/",
        state: "state",
        jobs: ["/api/job/1/", "/api/job/2/"]
      }
    ];
  });

  it("should be a function", () => {
    expect(commandModalReducer).toEqual(expect.any(Function));
  });

  describe("matching type", () => {
    it("should return the payload", () => {
      expect(
        commandModalReducer(deepFreeze({}), {
          type: SHOW_COMMAND_MODAL_ACTION,
          payload: commands
        })
      ).toEqual(commands);
    });
  });

  describe("non-matching type", () => {
    it("should return the state", () => {
      expect(
        commandModalReducer(deepFreeze({}), {
          type: "NON_EXISTENT_TYPE",
          payload: { key: "val" }
        })
      ).toEqual({});
    });
  });
});
