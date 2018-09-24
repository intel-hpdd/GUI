import * as fp from "@iml/fp";
import removeUsedLnetOptionsFilter from "../../../../source/iml/lnet/remove-used-lnet-options-filter.js";
import lnetOptions from "../../../../source/iml/lnet/lnet-options.js";

describe("Remove used LNet options", () => {
  let removeUsedLnetOptions;
  beforeEach(() => {
    removeUsedLnetOptions = removeUsedLnetOptionsFilter();
  });

  it("should filter out used values", () => {
    const networkInterfaces = createNetworkInterfaces([5, 6, 7]);
    const filtered = removeUsedLnetOptions(lnetOptions, networkInterfaces, networkInterfaces[0]);

    expect(filtered).toMatchSnapshot();
  });
  it("should always have Not Lustre Network", () => {
    const networkInterface = createNetworkInterface(-1);
    const networkInterface0 = createNetworkInterface(0);
    const networkInterfaces = [networkInterface, networkInterface, networkInterface0];
    const filtered = removeUsedLnetOptions(lnetOptions, networkInterfaces, networkInterface0);
    expect(filtered).toEqual(lnetOptions);
  });
  it("should work when all options are used", () => {
    const values = fp.map(x => x.value)(lnetOptions);
    const networkInterfaces = createNetworkInterfaces(values);
    const filtered = removeUsedLnetOptions(lnetOptions, networkInterfaces, networkInterfaces[1]);
    expect(filtered).toEqual([{ name: "Not Lustre Network", value: -1 }, { name: "Lustre Network 0", value: 0 }]);
  });

  function createNetworkInterface(id) {
    return { nid: { lnd_network: id } };
  }

  function createNetworkInterfaces(ids) {
    return ids.map(function create(id) {
      return createNetworkInterface(id);
    });
  }
});
