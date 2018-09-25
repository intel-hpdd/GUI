// @flow

describe("tz picker resolves", () => {
  let mockResolveStream, mockSelect, mockBroadcaster, p, data, tzPicker$;
  beforeEach(() => {
    data = { isUtc: false };
    p = Promise.resolve(data);
    mockResolveStream = jest.fn(() => p);
    tzPicker$ = {};
    mockSelect = jest.fn(() => tzPicker$);
    mockBroadcaster = jest.fn();

    jest.mock("../../../../source/iml/promise-transforms.js", () => ({
      resolveStream: mockResolveStream
    }));

    jest.mock("../../../../source/iml/store/get-store.js", () => ({
      select: mockSelect
    }));

    jest.mock("../../../../source/iml/broadcaster.js", () => mockBroadcaster);

    require("../../../../source/iml/tz-picker/tz-picker-resolves.js").tzPickerB();
  });

  it("should select the tzPicker stream from the store", () => {
    expect(mockSelect).toHaveBeenCalledOnceWith("tzPicker");
  });

  it("should resolve the store stream", () => {
    expect(mockResolveStream).toHaveBeenCalledOnceWith(tzPicker$);
  });

  it("should invoke broadcaster", () => {
    expect(mockBroadcaster).toHaveBeenCalledOnceWith(data);
  });
});
