// @flow

import highland, { type HighlandStreamT } from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import type { StorageResource } from "../../../../source/iml/storage/storage-types.js";
import { renderToSnapshot } from "../../../test-utils.js";
import { querySelector } from "../../../../source/iml/dom-utils.js";

const createResourceData = (deletable: boolean): StorageResource => ({
  alerts: [{}],
  alias: "my-resource",
  attributes: {
    "1": {
      class: "my-class",
      label: "Name",
      markup: "<span>resource1</span>",
      raw: "resource1"
    }
  },
  charts: [
    {
      series: ["1", "2"],
      title: "chart title"
    }
  ],
  class_name: "my-class",
  default_alias: "my-resource",
  deletable,
  id: 1,
  parent_classes: ["class1", "class2"],
  plugin_name: "plugin-name",
  propagated_alerts: [{}],
  resource_uri: "/storage/resource/33",
  stats: {
    "1": {
      data: null,
      label: "World Series",
      name: "world-series",
      type: "timeseries",
      unit_name: "time-unit"
    },
    "2": {
      data: {
        bin_labels: ["label1"],
        values: [1, 2]
      },
      label: "Histogram",
      name: "Histogram",
      type: "histogram",
      unit_name: "time-unit"
    }
  },
  storage_id_str: "storage-id-str"
});

describe("storage detail component", () => {
  let StorageDetail,
    storageResource$: HighlandStreamT<StorageResource>,
    alertIndicator$: () => HighlandStreamT<Object>,
    mockStorageResourceHistogram,
    mockStorageResourceTimeSeries,
    mockSocketStream,
    mockGlobal,
    socket$: HighlandStreamT<Object>,
    node: HTMLElement,
    alias: HTMLInputElement,
    saveBtn: HTMLButtonElement,
    deleteBtn: HTMLButtonElement;

  beforeEach(() => {
    storageResource$ = highland();
    alertIndicator$ = broadcaster(highland([[]]));

    mockStorageResourceHistogram = jest.fn(() => "storageResourceHistogram");
    mockStorageResourceTimeSeries = jest.fn(() => "storageResourceTimeSeries");
    socket$ = highland();
    mockSocketStream = jest.fn(() => socket$);
    mockGlobal = {
      location: {
        href: "/storage/23"
      }
    };

    jest.mock("../../../../source/iml/storage/storage-resource-histogram.js", () => mockStorageResourceHistogram);

    jest.mock("../../../../source/iml/storage/storage-resource-time-series.js", () => mockStorageResourceTimeSeries);

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    ({ StorageDetail } = require("../../../../source/iml/storage/storage-detail-component.js"));

    storageResource$.write(createResourceData(false));

    node = renderToSnapshot(<StorageDetail stream={storageResource$} alertIndicatorB={alertIndicator$} />);

    querySelector(document, "body").appendChild(node);

    saveBtn = (querySelector(node, "#saveButton"): any);
    alias = (querySelector(node, "#alias"): any);
  });

  afterEach(() => {
    if (document.body) document.body.removeChild(node);
  });

  it("should render the storage detail form", () => {
    expect(node).toMatchSnapshot();
  });

  describe("changing the alias", () => {
    beforeEach(() => {
      alias.value = "something different";
      alias.dispatchEvent(new Event("input"));
    });

    describe("saving the alias", () => {
      beforeEach(() => {
        saveBtn.click();
      });

      it("should update the storage resource", () => {
        expect(mockSocketStream).toHaveBeenCalledWith(
          "/storage_resource/1",
          {
            method: "put",
            json: {
              alias: "something different"
            }
          },
          true
        );
      });

      it("should match the snapshot", () => {
        expect(node).toMatchSnapshot();
      });

      describe("after saving the alias", () => {
        beforeEach(() => {
          socket$.end();
        });

        it("should have the new alias", () => {
          expect(alias.value).toEqual("something different");
        });

        it("should match the snapshot", () => {
          expect(node).toMatchSnapshot();
        });
      });
    });
  });

  describe("deleting a resource", () => {
    beforeEach(() => {
      storageResource$.write(createResourceData(true));
      deleteBtn = (querySelector(node, "#deleteButton"): any);

      deleteBtn.click();
    });

    it("should delete the resource", () => {
      expect(mockSocketStream).toHaveBeenCalledWith(
        "/storage_resource/1",
        {
          method: "delete"
        },
        true
      );
    });

    it("should match the snapshot", () => {
      expect(node).toMatchSnapshot();
    });

    describe("after deleting", () => {
      beforeEach(() => {
        socket$.end();
      });

      it("should navigate to /storage", () => {
        expect(mockGlobal.location.href).toEqual("/ui/configure/storage");
      });
    });
  });
});
