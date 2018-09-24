describe("to date filter", () => {
  let mockCreateDate, result, mod, d;
  beforeEach(() => {
    mockCreateDate = jest.fn(() => "2015-05-05T00:00:00.000Z");

    jest.mock("../../../../source/iml/create-date.js", () => mockCreateDate);

    mod = require("../../../../source/iml/filters/to-date-filter.js");
  });

  it("should return the date object", () => {
    result = mod.default(d);
    expect(result).toEqual("2015-05-05T00:00:00.000Z");
  });
});
