// @flow

import angular from "../../../angular-mock-setup.js";
import highland, { type HighlandStreamT } from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import type { State } from "../../../../source/iml/storage/storage-reducer.js";
import { querySelector } from "../../../../source/iml/dom-utils.js";

describe("storage component", () => {
  let mockSocketStream, storage$: HighlandStreamT<State>, $scope, $compile, template, root;

  beforeEach(
    angular.mock.module($compileProvider => {
      mockSocketStream = jest.fn();
      jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

      $compileProvider.component(
        "addStorage",
        require("../../../../source/iml/storage/add-storage-component.js").default
      );

      storage$ = highland();
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    })
  );

  beforeEach(() => {
    $scope.storage$ = broadcaster(storage$);
    template = '<add-storage storage-b="storage$"></add-storage>';
  });

  it("should render nothing with no data", () => {
    storage$.write({
      config: {
        sortDesc: false,
        sortKey: "name",
        loading: false,
        selectIndex: 0,
        entries: 10,
        offset: 0
      },
      resourceClasses: [],
      resources: {
        meta: {
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total_count: 0
        },
        objects: []
      }
    });

    root = $compile(template)($scope)[0];

    expect(root).toMatchSnapshot();
  });

  it("should render with data", () => {
    storage$.write({
      config: {
        sortDesc: false,
        sortKey: "name",
        loading: true,
        selectIndex: 0,
        entries: 1,
        offset: 0
      },
      resourceClasses: [
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
        }
      ],
      resources: {
        meta: {
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total_count: 1
        },
        objects: []
      }
    });

    root = $compile(template)($scope)[0];

    expect(root).toMatchSnapshot();
  });

  describe("interaction", () => {
    let stream;

    beforeEach(() => {
      stream = highland();
      mockSocketStream.mockReturnValue(stream);

      storage$.write({
        config: {
          sortDesc: false,
          sortKey: "name",
          loading: true,
          selectIndex: 0,
          entries: 1,
          offset: 0
        },
        resourceClasses: [
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
          }
        ],
        resources: {
          meta: {
            limit: 10,
            next: null,
            offset: 0,
            previous: null,
            total_count: 1
          },
          objects: []
        }
      });

      root = $compile(template)($scope)[0];
      querySelector(document, "body").appendChild(root);
    });

    afterEach(() => {
      querySelector(document, "body").removeChild(root);
    });

    describe("submitting the form", () => {
      beforeEach(() => {
        const size: HTMLInputElement = (querySelector(root, "#size"): any);
        size.value = "foo";
        size.dispatchEvent(new Event("input"));

        const uuid: HTMLInputElement = (querySelector(root, "#uuid"): any);
        uuid.value = "bar";
        uuid.dispatchEvent(new Event("input"));

        querySelector(root, "button").dispatchEvent(new MouseEvent("click"));
      });

      it("should submit the form", () => {
        expect(mockSocketStream).toHaveBeenCalledWith(
          "/storage_resource",
          {
            json: {
              attrs: { size: "foo", uuid: "bar" },
              class_name: "EMCPower",
              plugin_name: "linux"
            },
            method: "post"
          },
          true
        );
      });

      it("should render loading", () => {
        expect(root).toMatchSnapshot();
      });

      it("should render success", () => {
        stream.write({});

        expect(root).toMatchSnapshot();
      });

      it("should render error", () => {
        // $FlowFixMe: Internal error type for testing
        stream.write({
          __HighlandStreamError__: true,
          error: new Error("boom")
        });

        expect(root).toMatchSnapshot();
      });
    });
  });
});
