import serverActionsFactory from "../../../../source/iml/server/server-actions.js";

describe("server actions", () => {
  let serverActions, hosts, detectFs, rewriteTargetConfig, installUpdates;

  beforeEach(() => {
    serverActions = serverActionsFactory();

    hosts = [
      {
        id: 1,
        resource_uri: "/api/host/1",
        server_profile: { managed: true }
      }
    ];
    detectFs = serverActions[0];
    rewriteTargetConfig = serverActions[1];
    installUpdates = serverActions[2];
  });

  it("should be an array", () => {
    expect(serverActions).toEqual(expect.any(Array));
  });
  it("should contain actions", () => {
    expect(serverActions).toEqual([
      {
        value: "Detect File Systems",
        message: "Detecting File Systems",
        helpTopic: "detect_file_systems-dialog",
        buttonTooltip: expect.any(Function),
        jobClass: "DetectTargetsJob",
        convertToJob: expect.any(Function)
      },
      {
        value: "Re-write Target Configuration",
        message: "Updating file system NIDs",
        helpTopic: "rewrite_target_configuration-dialog",
        buttonTooltip: expect.any(Function),
        buttonDisabled: expect.any(Function),
        toggleDisabledReason: expect.any(Function),
        toggleDisabled: expect.any(Function),
        jobClass: "UpdateNidsJob",
        convertToJob: expect.any(Function)
      },
      {
        value: "Install Updates",
        message: "Install updates",
        helpTopic: "install_updates_dialog",
        buttonTooltip: expect.any(Function),
        buttonDisabled: expect.any(Function),
        toggleDisabledReason: expect.any(Function),
        toggleDisabled: expect.any(Function),
        jobClass: "UpdateJob",
        convertToJob: expect.any(Function)
      }
    ]);
  });
  it("should convert detect file systems hosts to a job", () => {
    const result = detectFs.convertToJob(hosts);
    expect(result).toEqual([{ class_name: "DetectTargetsJob", args: { hosts: ["/api/host/1"] } }]);
  });
  it("should check if a re-write target configuration host is disabled", () => {
    const result = rewriteTargetConfig.buttonDisabled(hosts);
    expect(result).toBe(false);
  });
  it("should convert install updates hosts to a job", () => {
    const result = installUpdates.convertToJob(hosts);
    expect(result).toEqual([{ class_name: "UpdateJob", args: { host_id: 1 } }]);
  });

  describe("install updates button", () => {
    let servers, activeServers;

    beforeEach(() => {
      servers = [
        {
          id: 1,
          label: "mds1",
          needs_update: false,
          immutable_state: false
        },
        {
          id: 2,
          label: "mds2",
          needs_update: true,
          immutable_state: false
        }
      ];
      activeServers = [1, 2];
    });

    describe("button tooltip", () => {
      describe("with member of filesystem and mutable", () => {
        it("should return a message", () => {
          const message = installUpdates.buttonTooltip(servers, activeServers);
          expect(message).toEqual(`All servers are part of an active file system.
 Stop associated active file system(s) to install updates.`);
        });
      });

      describe("with no updates", () => {
        it("should return a message", () => {
          servers[1].needs_update = false;
          const message = installUpdates.buttonTooltip(servers, activeServers);
          expect(message).toEqual("No updates available.");
        });
      });

      describe("with default case", () => {
        it("with no active servers", () => {
          activeServers = [];
          const message = installUpdates.buttonTooltip(servers, activeServers);
          expect(message).toEqual("Install updated software on the selected servers.");
        });
      });
    });

    describe("button disabled", () => {
      describe("with no updates", () => {
        it("should be disabled", () => {
          servers[1].needs_update = false;
          const isDisabled = installUpdates.buttonDisabled(servers, activeServers);
          expect(isDisabled).toBe(true);
        });
      });

      describe("with member of fs", () => {
        it("should be disabled", () => {
          const isDisabled = installUpdates.buttonDisabled(servers, activeServers);
          expect(isDisabled).toBe(true);
        });
      });

      describe("with updates and ", () => {
        it("should be disabled", () => {
          activeServers = [];
          const isDisabled = installUpdates.buttonDisabled(servers, activeServers);
          expect(isDisabled).toBe(false);
        });
      });
    });

    describe("toggle disabled reason", () => {
      describe("with no updates", () => {
        it("should indicate that there are no updates", () => {
          servers[1].needs_update = false;
          const message = installUpdates.toggleDisabledReason(servers[1], activeServers);
          expect(message).toEqual("No updates for mds2.");
        });
      });

      describe("with member of fsandmutable", () => {
        it("should indicate that the server is a memeber of an active fs", () => {
          const message = installUpdates.toggleDisabledReason(servers[1], activeServers);
          expect(message).toEqual("mds2 is a member of an active filesystem.");
        });
      });
    });

    describe("toggle disabled", () => {
      describe("with no updates", () => {
        it("should return true", () => {
          servers[1].needs_update = false;
          const message = installUpdates.toggleDisabled(servers[1], activeServers);
          expect(message).toEqual(true);
        });
      });

      describe("with member of fs and mutable", () => {
        it("should return true", () => {
          const message = installUpdates.toggleDisabled(servers[1], activeServers);
          expect(message).toEqual(true);
        });
      });

      describe("with updates and no members of an active fs", () => {
        it("should return false", () => {
          activeServers = [];
          const message = installUpdates.toggleDisabled(servers[1], activeServers);
          expect(message).toEqual(false);
        });
      });
    });
  });
});
