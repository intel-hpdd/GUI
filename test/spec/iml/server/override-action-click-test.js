import highland from "highland";
import overrideActionClickFactory from "../../../../source/iml/server/override-action-click.js";

describe("override action click", () => {
  let record, openAddServerModal, overrideActionClick, addServerSteps;

  beforeEach(() => {
    addServerSteps = {
      ADD: "add",
      STATUS: "status",
      SELECT_PROFILE: "select profile"
    };

    openAddServerModal = jest.fn(() => ({
      resultStream: highland()
    }));

    record = {
      state: "undeployed",
      install_method: "root_password"
    };

    overrideActionClick = overrideActionClickFactory(addServerSteps, openAddServerModal);
  });

  it("should be a function", () => {
    expect(overrideActionClick).toEqual(expect.any(Function));
  });

  it("should fallback without an action state", () => {
    overrideActionClick(record, {}).each(resp => {
      expect(resp).toEqual("fallback");
    });
  });

  [
    // add step
    {
      record: {
        state: "undeployed",
        install_method: "root_password"
      },
      action: {
        state: "deployed"
      },
      step: "add"
    },
    // server status step
    {
      record: {
        state: "undeployed",
        install_method: "existing_keys_choice"
      },
      action: {
        state: "deployed"
      },
      step: "status"
    },
    // select profile
    {
      record: {
        state: "pending",
        install_method: "existing_keys_choice",
        server_profile: {
          initial_state: "unconfigured"
        }
      },
      action: {
        state: "deployed"
      },
      step: "select profile"
    }
  ].forEach(data => {
    it("should open the add server modal when needed for step " + data.step, () => {
      overrideActionClick(data.record, data.action);
      expect(openAddServerModal).toHaveBeenCalledOnceWith(data.record, data.step);
    });
  });
});
