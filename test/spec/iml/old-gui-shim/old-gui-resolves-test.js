import highland from "highland";
import * as maybe from "@iml/maybe";

describe("old gui resolves", () => {
  let mockGetStore, mockSocketStream, mod;

  beforeEach(() => {
    mockGetStore = {
      select: jest.fn()
    };
    mockSocketStream = jest.fn();

    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    mod = require("../../../../source/iml/old-gui-shim/old-gui-resolves.js");
  });

  describe("old filesystem detail resolve", () => {
    it("should resolve with the specified id", async () => {
      mockGetStore.select.mockImplementation(key => {
        if (key === "fileSystems")
          return highland([[{ id: 5, label: "fs5" }, { id: 7, label: "fs7" }, { id: 10, label: "fs10" }]]);
      });

      const result = await mod.oldFilesystemDetailResolve.resolve.getData({
        id: 7
      });
      expect(result).toEqual(maybe.ofJust({ id: 7, label: "fs7" }));
    });
  });

  describe("old user detail resolve", () => {
    it("should resolve with the specified id", async () => {
      mockGetStore.select.mockImplementation(key => {
        if (key === "users")
          return highland([
            [{ id: 5, username: "adam" }, { id: 7, username: "stephany" }, { id: 10, username: "mickey" }]
          ]);
      });

      const result = await mod.oldUserDetailResolve.resolve.getData({ id: 7 });
      expect(result).toEqual({ label: "stephany" });
    });
  });

  describe("old target resolve", () => {
    it("should resolve with the specified id", async () => {
      mockGetStore.select.mockImplementation(key => {
        if (key === "targets")
          return highland([[{ id: 5, label: "target5" }, { id: 7, label: "target7" }, { id: 10, label: "target10" }]]);
      });

      const result = await mod.oldTargetResolve.resolve.getData({ id: 7 });
      expect(result).toEqual(maybe.ofJust({ id: 7, label: "target7" }));
    });
  });
});
