// @flow

import highland from "highland";
import { streamToPromise } from "../../../../source/iml/promise-transforms.js";

describe("storageResources", () => {
  let mockStore, mockSocketStream, storageResources, state;

  beforeEach(() => {
    state = {
      resourceClasses: [{ plugin_name: "pluginName", class_name: "className" }],
      resources: null,
      config: {
        selectIndex: 0,
        sortKey: "",
        sortDesc: false,
        loading: false,
        entries: 10,
        offset: 0
      }
    };

    mockStore = jest.genMockFromModule("../../../../source/iml/store/get-store.js").default;
    const s = highland();

    mockStore.select.mockImplementationOnce(() => {
      s.write(state);

      return s;
    });

    mockSocketStream = jest.fn(() => highland(["stream"]));
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);
    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);

    storageResources = require("../../../../source/iml/storage/storage-resources.js").default;
  });

  it("should be a function", () => {
    expect(storageResources).toEqual(expect.any(Function));
  });

  it("should call the store with the key", async () => {
    await streamToPromise(storageResources());

    expect(mockStore.select).toHaveBeenCalledWith("storage");
  });

  it("should call socketStream with the expected config", async () => {
    await streamToPromise(storageResources());

    expect(mockSocketStream).toHaveBeenCalledOnceWith("/api/storage_resource/pluginName/className/", {
      qs: { limit: 10, offset: 0 }
    });
  });

  it("should add sorting desc if on the config", async () => {
    state.config.sortKey = "foo";
    state.config.sortDesc = true;

    await streamToPromise(storageResources());

    expect(mockSocketStream).toHaveBeenCalledOnceWith("/api/storage_resource/pluginName/className/", {
      qs: { limit: 10, offset: 0, order_by: "-attr_foo" }
    });
  });

  it("should add sorting asc if on the config", async () => {
    state.config.sortKey = "foo";
    state.config.sortDesc = false;

    await streamToPromise(storageResources());

    expect(mockSocketStream).toHaveBeenCalledOnceWith("/api/storage_resource/pluginName/className/", {
      qs: { limit: 10, offset: 0, order_by: "attr_foo" }
    });
  });

  it("should dispatch a loading event", async () => {
    await streamToPromise(storageResources());

    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      payload: false,
      type: "SET_STORAGE_TABLE_LOADING"
    });
  });
});
