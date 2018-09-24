describe("hostlist filter service", () => {
  let filter, hostlistFilter, mockPdshFilter, mockNaturalSortFilter;
  beforeEach(() => {
    mockPdshFilter = jest.fn(() => "host1Filtered");
    mockNaturalSortFilter = jest.fn();

    jest.mock("../../../../source/iml/filters/pdsh-filter.js", () => mockPdshFilter);
    jest.mock("../../../../source/iml/filters/natural-sort-filter.js", () => mockNaturalSortFilter);

    hostlistFilter = require("../../../../source/iml/server/hostlist-filter.js").default;
    filter = hostlistFilter(mockPdshFilter, mockNaturalSortFilter);
  });

  it("should expose the expected interface", () => {
    expect(filter).toEqual({
      setHosts: expect.any(Function),
      setHash: expect.any(Function),
      setFuzzy: expect.any(Function),
      setReverse: expect.any(Function),
      compute: expect.any(Function)
    });
  });

  describe("computing a filtered hostlist", () => {
    beforeEach(() => {
      filter
        .setHosts(["host1", "host2"])
        .setHash({ host1: "" })
        .setFuzzy(true)
        .setReverse(false)
        .compute();
    });

    it("should call the pdsh filter", () => {
      expect(mockPdshFilter).toHaveBeenCalledOnceWith(["host1", "host2"], { host1: "" }, expect.any(Function), true);
    });

    it("should call the natural sort filter", () => {
      expect(mockNaturalSortFilter).toHaveBeenCalledOnceWith("host1Filtered", expect.any(Function), false);
    });
  });
});
