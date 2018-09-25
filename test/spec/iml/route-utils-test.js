import * as maybe from "@iml/maybe";

import { apiPathToUiPath, getResolvedData } from "../../../source/iml/route-utils.js";

describe("route utils", () => {
  it("should convert a filesystem api resource to a routeable link", () => {
    expect(apiPathToUiPath("/api/filesystem/1/")).toEqual("configure/filesystem/1/");
  });

  it("should convert a host api resource to a routeable link", () => {
    expect(apiPathToUiPath("/api/host/1/")).toEqual("configure/server/1/");
  });

  it("should convert any other api resource to a routeable link", () => {
    expect(apiPathToUiPath("/api/volume/1/")).toEqual("volume/1/");
  });
});

describe("getResolvedData", () => {
  let transition, resolveName, result;
  beforeEach(() => {
    transition = {
      getResolveTokens: jest.fn(),
      getResolveValue: jest.fn()
    };
    resolveName = "getData";
  });

  describe("with the resolve name", () => {
    beforeEach(() => {
      transition.getResolveTokens.mockReturnValue(["fsStream", "targetStream", "getData", "otherStream"]);

      transition.getResolveValue.mockReturnValue({
        label: "fs1",
        kind: "filesystem"
      });

      result = maybe.withDefault(() => {}, getResolvedData(transition, resolveName));
    });

    it("should call getResolveTokens", () => {
      expect(transition.getResolveTokens).toHaveBeenCalledTimes(1);
    });

    it("should call getResolveValue", () => {
      expect(transition.getResolveValue).toHaveBeenCalledOnceWith("getData");
    });

    it("should return the data", () => {
      expect(result).toEqual({
        label: "fs1",
        kind: "filesystem"
      });
    });
  });

  describe("without resolve name", () => {
    beforeEach(() => {
      transition.getResolveTokens.mockReturnValue(["fsStream", "targetStream", "otherStream"]);

      result = maybe.withDefault(() => "no match found", getResolvedData(transition, resolveName));
    });

    it("should call getResolveTokens", () => {
      expect(transition.getResolveTokens).toHaveBeenCalledTimes(1);
    });

    it("should not call getResolveValue", () => {
      expect(transition.getResolveValue).not.toHaveBeenCalled();
    });

    it("should return the default result", () => {
      expect(result).toBe("no match found");
    });
  });
});
