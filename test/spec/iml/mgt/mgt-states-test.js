describe("mgt states", () => {
  let mgtState, mockGroups, mockMgt$, mockLocks$, mockMgtAlertIndicatorB;

  beforeEach(() => {
    mockGroups = {
      SUPERUSERS: "superusers",
      FS_ADMINS: "filesystem_administrators",
      FS_USERS: "filesystem_users"
    };

    mockMgt$ = jest.fn();
    mockLocks$ = jest.fn();
    mockMgtAlertIndicatorB = jest.fn();

    jest.mock("../../../../source/iml/mgt/mgt-resolves.js", () => ({
      mgt$: mockMgt$,
      locks$: mockLocks$,
      mgtAlertIndicatorB: mockMgtAlertIndicatorB
    }));
    jest.mock("../../../../source/iml/auth/authorization.js", () => ({
      GROUPS: mockGroups
    }));

    mgtState = require("../../../../source/iml/mgt/mgt-states.js").mgtState;
  });

  it("should create the state", () => {
    expect(mgtState).toEqual({
      name: "app.mgt",
      url: "/configure/mgt",
      component: "mgtPage",
      params: {
        resetState: {
          dynamic: true
        }
      },
      data: {
        helpPage: "Graphical_User_Interface_9_0.html#9.3.8",
        access: mockGroups.FS_ADMINS,
        anonymousReadProtected: true,
        kind: "MGTs",
        icon: "fa-bullseye"
      },
      resolve: {
        mgt$: mockMgt$,
        mgtAlertIndicatorB: mockMgtAlertIndicatorB,
        locks$: mockLocks$
      }
    });
  });
});
