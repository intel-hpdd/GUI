import {
  addServerStepsFactory,
  getAddServerManagerFactory
} from "../../../../source/iml/server/get-add-server-manager.js";

describe("get add server manager", () => {
  let ADD_SERVER_STEPS,
    addServerSteps,
    addServersStep,
    serverStatusStep,
    selectServerProfileStep,
    stepsManager,
    addStep,
    addWaitingStep,
    waitUntilLoadedStep;

  beforeEach(() => {
    ADD_SERVER_STEPS = {
      ADD: "addServersStep",
      STATUS: "serverStatusStep",
      SELECT_PROFILE: "selectServerProfileStep"
    };

    addServersStep = {};
    serverStatusStep = {};
    selectServerProfileStep = {};

    addStep = jest.fn();
    addWaitingStep = jest.fn();

    stepsManager = jest.fn(() => ({
      addStep: addStep,
      addWaitingStep: addWaitingStep
    }));

    waitUntilLoadedStep = {};
  });

  describe("get add server manager service", () => {
    let addServerManager, manager;
    beforeEach(() => {
      addServerSteps = addServerStepsFactory(
        ADD_SERVER_STEPS,
        addServersStep,
        serverStatusStep,
        selectServerProfileStep
      );

      addServerManager = getAddServerManagerFactory(
        addServerSteps,
        stepsManager,
        waitUntilLoadedStep,
        ADD_SERVER_STEPS
      );

      manager = addServerManager();
    });

    it("should add each step", () => {
      expect(addStep.mock.calls).toEqual([
        ["addServersStep", {}],
        ["serverStatusStep", {}],
        ["selectServerProfileStep", {}]
      ]);
    });
    it("should add a waiting step", () => {
      expect(addWaitingStep).toHaveBeenCalledOnceWith(waitUntilLoadedStep);
    });
    it("should expose the server steps", () => {
      expect(manager.SERVER_STEPS).toEqual(ADD_SERVER_STEPS);
    });
  });
});
