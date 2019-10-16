import highland from "highland";
import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("server resolves", () => {
  let mockStore, serverResolves;

  beforeEach(() => {
    mockStore = {
      select: jest.fn()
    };

    jest.mock("../../../../source/iml/store/get-store", () => mockStore);

    const mod = require("../../../../source/iml/server/server-resolves.js");

    serverResolves = mod.default;
  });

  it("should be a function", () => {
    expect(serverResolves).toEqual(expect.any(Function));
  });

  describe("getting a promise", () => {
    let promise;

    beforeEach(() => {
      mockStore.select.mockImplementation(() => highland());
      promise = serverResolves();
    });

    it("should create a locksStream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("locks");
    });

    it("should create an alertMonitorStream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("alertIndicators");
    });

    it("should create a servers stream", () => {
      expect(mockStore.select).toHaveBeenCalledWith("server");
    });

    it("should create a lnet configuration stream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("lnetConfiguration");
    });

    it("should create a targets stream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("targets");
    });

    it("should create a filesystem stream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("fileSystems");
    });

    it("should return an object of streams", async () => {
      const result = await promise;

      expect(result).toEqual({
        locksStream: expect.any(Function),
        alertMonitorStream: expect.any(Function),
        lnetConfigurationStream: expect.any(Function),
        serversStream: expect.any(Object),
        activeServersStream: expect.any(Object)
      });
    });
  });

  describe("activeServerStream", () => {
    let streams, servers, targets, filesystems;
    beforeEach(() => {
      servers = [
        {
          address: "mds1",
          id: 1
        },
        {
          address: "mds2",
          id: 2
        },
        {
          address: "oss1",
          id: 3
        },
        {
          address: "oss2",
          id: 4
        }
      ];

      targets = [
        {
          id: 1,
          active_host: "/api/host/1/",
          filesystems: [
            {
              id: 1,
              name: "fs"
            }
          ],
          filesystem_id: null
        },
        {
          id: 2,
          active_host: "/api/host/2/",
          filesystems: null,
          filesystem_id: 1
        },
        {
          id: 3,
          active_host: "/api/host/3/",
          filesystems: null,
          filesystem_id: 1
        },
        {
          id: 4,
          active_host: "/api/host/4/",
          filesystems: null,
          filesystem_id: 1
        },
        {
          id: 5,
          active_host: "/api/host/3/",
          filesystems: null,
          filesystem_id: 1
        },
        {
          id: 6,
          active_host: "/api/host/4/",
          filesystems: null,
          filesystem_id: 1
        }
      ];

      filesystems = [
        {
          id: 1,
          name: "fs",
          state: "available"
        }
      ];
    });

    describe("with single filesystem", () => {
      describe("having available state", () => {
        it("should show all servers as being active", async () => {
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 2, 3, 4]);
        });
      });

      describe("having unavailable state", () => {
        it("should show all servers as being active", async () => {
          filesystems[0].state = "unavailable";
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 2, 3, 4]);
        });
      });

      describe("where filesystem is stopped", () => {
        it("should not show any servers as being active", async () => {
          filesystems[0].state = "stopped";
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([]);
        });
      });

      describe("with an unmounted target", () => {
        it("should show only active servers as being active", async () => {
          targets[1].active_host = null;
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 3, 4]);
        });
      });

      describe("with a removed host", () => {
        it("should show all servers as being active", async () => {
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([[servers[0], servers[1], servers[3]]]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 2, 4]);
        });
      });
    });

    describe("with multiple filesystems", () => {
      beforeEach(() => {
        filesystems = [
          ...filesystems,
          {
            id: 2,
            name: "fs2",
            state: "available"
          }
        ];

        targets[0].filesystems = [
          ...targets[0].filesystems,
          {
            id: 2,
            name: "fs2"
          }
        ];

        targets = [
          ...targets,
          {
            id: 7,
            active_host: "/api/host/2/",
            filesystems: null,
            filesystem_id: 2
          },
          {
            id: 8,
            active_host: "/api/host/3/",
            filesystems: null,
            filesystem_id: 2
          },
          {
            id: 9,
            active_host: "/api/host/4/",
            filesystems: null,
            filesystem_id: 2
          }
        ];
      });

      describe("where both filesystems have available state", () => {
        it("should show all servers as being active", async () => {
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 2, 3, 4]);
        });
      });

      describe("where one of the filesystems is stopped", () => {
        it("should show all servers as being active", async () => {
          filesystems[0].state = "stopped";
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 2, 3, 4]);
        });
      });

      describe("where both filesystems are stopped", () => {
        it("should show no servers as being active", async () => {
          filesystems = filesystems.map(x => {
            x.state = "stopped";
            return x;
          });
          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([]);
        });
      });

      describe("with a server containing targets on fs2 that is not on fs1", () => {
        fit("should show only the server associated with fs2 but not fs1 as being active", async () => {
          filesystems[0].state = "stopped";
          servers = [
            ...servers,
            {
              id: 5,
              address: "mds3"
            },
            {
              id: 6,
              address: "oss3"
            }
          ];

          targets = targets.map(x => {
            if (x.id === 7) x.active_host = "/api/host/5/";
            else if (x.id === 8) x.active_host = "/api/host/6/";
            else if (x.id === 9) x.active_host = "/api/host/6/";

            return x;
          });

          mockStore.select.mockImplementation(key => {
            if (key === "server") return highland([servers]);
            else if (key === "targets") return highland([targets]);
            else if (key === "fileSystems") return highland([filesystems]);
            else return highland([]);
          });

          const mod = require("../../../../source/iml/server/server-resolves.js");

          serverResolves = mod.default;

          streams = await serverResolves();

          const activeServers = await streamToPromise(streams.activeServersStream);
          expect(activeServers).toEqual([1, 5, 6]);
        });
      });
    });
  });
});
