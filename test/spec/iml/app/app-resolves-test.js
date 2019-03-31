import highland from "highland";

describe("app resolves", () => {
  let mockSocketStream, promise, stream, locksStream, appModule, mockCacheInitialData, mockGetStore;
  beforeEach(() => {
    promise = {};
    stream = highland([promise]);
    mockSocketStream = jest.fn();
    mockSocketStream.mockReturnValue(stream);
    mockCacheInitialData = { session: {} };
    locksStream = highland();
    mockGetStore = {
      select: jest.fn(() => locksStream)
    };
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);
    jest.mock("../../../../source/iml/environment.js", () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    appModule = require("../../../../source/iml/app/app-resolves.js");
  });

  describe("app alert stream", () => {
    let result;
    beforeEach(async () => {
      result = await appModule.alertStream();
    });
    it("should return a promise", done => {
      result.each(x => {
        expect(x).toBe(promise);
        done();
      });
    });
    it("should create a socket connection", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith("/alert/", {
        jsonMask: "objects(message)",
        qs: { severity__in: ["WARNING", "ERROR"], limit: 0, active: true }
      });
    });
  });
  describe("app notification stream", () => {
    let result;
    beforeEach(async () => {
      result = await appModule.appNotificationStream();
    });
    it("should return a promise", done => {
      result.each(x => {
        expect(x).toBe(promise);
        done();
      });
    });
    it("should create a socket connection", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith("/health");
    });
  });
  describe("app session", () => {
    let appSession;
    beforeEach(() => {
      appSession = appModule.appSessionFactory();
    });
    it("should return the session", () => {
      expect(appSession).toBe(mockCacheInitialData.session);
    });
  });

  describe("sseResolves", () => {
    beforeEach(() => {
      locksStream.write({});
    });

    it("should return a Promise containing the lock information", async () => {
      const locks = await appModule.sseResolves();
      expect(locks).toEqual({});
    });
  });
});
