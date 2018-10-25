// @flow

import { render } from "inferno";
import { renderToSnapshot } from "../../../test-utils.js";
import { querySelector } from "../../../../source/iml/dom-utils.js";

describe("storage component", () => {
  let TableFilter, mockStore;

  beforeEach(() => {
    mockStore = { dispatch: jest.fn() };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);

    TableFilter = require("../../../../source/iml/storage/table-filter.js").default;
  });

  describe("TableFilter", () => {
    let state;
    beforeEach(() => {
      state = {
        sortDirection: "",
        sortKey: "name",
        storageResourceClassIndex: 0,
        storageResourcesClasses: [
          {
            class_name: "EMCPower",
            columns: [
              {
                label: "Size",
                name: "size"
              },
              {
                label: "Filesystem type",
                name: "filesystem_type"
              },
              {
                label: "Uuid",
                name: "uuid"
              }
            ],
            fields: [
              {
                class: "Bytes",
                label: "Size",
                name: "size",
                optional: false,
                user_read_only: false
              },
              {
                class: "Boolean",
                label: "Filesystem type",
                name: "filesystem_type",
                optional: true,
                user_read_only: false
              },
              {
                class: "String",
                label: "Uuid",
                name: "uuid",
                optional: false,
                user_read_only: false
              }
            ],
            id: 1,
            label: "linux-EMCPower",
            modified_at: "2017-07-19T13:58:02.615410",
            plugin_internal: true,
            plugin_name: "linux",
            resource_uri: "/api/storage_resource_class/1/",
            user_creatable: false
          },
          {
            class_name: "LinuxDeviceNode",
            columns: [
              {
                label: "Host id",
                name: "host_id"
              },
              {
                label: "Path",
                name: "path"
              },
              {
                label: "Logical drive",
                name: "logical_drive"
              }
            ],
            fields: [
              {
                class: "Integer",
                label: "Host id",
                name: "host_id",
                optional: false,
                user_read_only: false
              },
              {
                class: "PosixPath",
                label: "Path",
                name: "path",
                optional: false,
                user_read_only: false
              },
              {
                class: "ResourceReference",
                label: "Logical drive",
                name: "logical_drive",
                optional: true,
                user_read_only: false
              }
            ],
            id: 2,
            label: "linux-LinuxDeviceNode",
            modified_at: "2017-07-19T13:58:02.693359",
            plugin_internal: true,
            plugin_name: "linux",
            resource_uri: "/api/storage_resource_class/2/",
            user_creatable: false
          },
          {
            class_name: "LocalMount",
            columns: [
              {
                label: "Fstype",
                name: "fstype"
              },
              {
                label: "Mount point",
                name: "mount_point"
              }
            ],
            fields: [
              {
                class: "String",
                label: "Fstype",
                name: "fstype",
                optional: false,
                user_read_only: false
              },
              {
                class: "String",
                label: "Mount point",
                name: "mount_point",
                optional: false,
                user_read_only: false
              }
            ],
            id: 3,
            label: "linux-LocalMount",
            modified_at: "2017-07-19T13:58:02.876150",
            plugin_internal: true,
            plugin_name: "linux",
            resource_uri: "/api/storage_resource_class/3/",
            user_creatable: false
          }
        ],
        storageResources: {
          object: []
        }
      };
    });

    it("should render correctly", () => {
      expect(
        renderToSnapshot(<TableFilter classes={state.storageResourcesClasses} idx={state.storageResourceClassIndex} />)
      ).toMatchSnapshot();
    });

    it("should select a specific option", () => {
      expect.assertions(2);

      const root = document.createElement("div");
      querySelector(document, "body").appendChild(root);
      render(<TableFilter classes={state.storageResourcesClasses} idx={state.storageResourceClassIndex} />, root);

      const select: HTMLSelectElement = (querySelector(root, "select"): any);

      select.selectedIndex = 1;
      select.dispatchEvent(new Event("change"));

      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        type: "SET_STORAGE_SELECT_INDEX",
        payload: 1
      });

      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        payload: true,
        type: "SET_STORAGE_TABLE_LOADING"
      });
    });
  });
});
