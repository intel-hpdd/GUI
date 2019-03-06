// @flow

import commandModalReducer, {
  SHOW_COMMAND_MODAL_ACTION
} from "../../../../source/iml/command/command-modal-reducer.js";
import { type Command } from "../../../../source/iml/command/command-types.js";

describe("command modal reducer", () => {
  let sampleData: Command[];

  beforeEach(() => {
    sampleData = [
      {
        cancelled: false,
        complete: false,
        created_at: "created_at",
        errored: false,
        id: 1,
        jobs: [],
        logs: "logs",
        message: "message",
        state: "state",
        resource_uri: "uri"
      }
    ];
  });

  describe("showing the command modal", () => {
    it("should pass the commands", () => {
      const result = commandModalReducer([], { type: SHOW_COMMAND_MODAL_ACTION, payload: sampleData });
      expect(result).toEqual(sampleData);
    });

    describe("from an existing state", () => {
      it("should return the new state", () => {
        const existingState = [
          {
            cancelled: false,
            complete: true,
            created_at: "other created_at",
            errored: false,
            id: 1,
            jobs: [],
            logs: "logs",
            message: "message",
            state: "state",
            resource_uri: "uri"
          }
        ];

        const result = commandModalReducer(existingState, { type: SHOW_COMMAND_MODAL_ACTION, payload: sampleData });
        expect(result).toEqual(sampleData);
      });
    });
  });
});
