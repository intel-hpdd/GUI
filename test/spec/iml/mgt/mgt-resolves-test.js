import highland from "highland";

describe("mgt resolves", () => {
  let mockStore, mgtStream, locksStream, mgtAlertIndicatorStream;

  beforeEach(() => {
    mockStore = {
      select: jest.fn(() => highland())
    };

    jest.mock("../../../../source/iml/store/get-store", () => mockStore);

    const mod = require("../../../../source/iml/mgt/mgt-resolves.js");

    mgtStream = mod.mgt$;
    locksStream = mod.locks$;
    mgtAlertIndicatorStream = mod.mgtAlertIndicatorB;
  });

  it("should select alertIndicators", () => {
    mgtAlertIndicatorStream();

    expect(mockStore.select).toHaveBeenCalledOnceWith("alertIndicators");
  });

  it("should select jobIndicators", () => {
    locksStream();

    expect(mockStore.select).toHaveBeenCalledOnceWith("locks");
  });

  it("should select targets", () => {
    mockStore.select.mockReturnValue(highland());

    mgtStream();

    expect(mockStore.select).toHaveBeenCalledOnceWith("targets");
  });

  it("should filter targets for MGTs", () => {
    const spy = jest.fn();
    const s = highland();

    mockStore.select.mockReturnValue(s);

    mgtStream().each(spy);

    s.write([{ kind: "OST" }, { kind: "MGT" }]);

    expect(spy).toHaveBeenCalledOnceWith([{ kind: "MGT" }]);
  });
});
