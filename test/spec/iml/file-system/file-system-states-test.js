import highland from "highland";

describe("file system states", () => {
  let fileSystemListState, mockGroups, mockGetStore;

  beforeEach(() => {
    mockGroups = {
      SUPERUSERS: "superusers",
      FS_ADMINS: "filesystem_administrators",
      FS_USERS: "filesystem_users"
    };

    mockGetStore = {
      select: jest.fn(name => {
        if (name !== "locks") return [{ 1: name }];
        else return highland([{ lock: "data" }]);
      })
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);
    jest.mock("../../../../source/iml/auth/authorization.js", () => ({
      GROUPS: mockGroups
    }));

    fileSystemListState = require("../../../../source/iml/file-system/file-system-states.js").fileSystemListState;
  });

  it("should create the state", () => {
    expect(fileSystemListState).toEqual({
      url: "/configure/filesystem",
      name: "app.fileSystem",
      component: "fileSystemPage",
      params: {
        resetState: {
          dynamic: true
        }
      },
      data: {
        helpPage: "Graphical_User_Interface_9_0.html#9.3.3",
        access: mockGroups.FS_ADMINS,
        anonymousReadProtected: true,
        kind: "File Systems",
        icon: "fa-copy"
      },
      resolve: {
        fileSystem$: expect.any(Function),
        target$: expect.any(Function),
        locks$: expect.any(Function),
        alertIndicator$: expect.any(Function),
        metricPoll$: expect.any(Function)
      }
    });
  });
});
